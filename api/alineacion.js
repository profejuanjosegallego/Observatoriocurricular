const { getDb } = require('../lib/mongo');
const { MATERIAS_VALIDAS } = require('../lib/constants');
const crypto = require('crypto');

// Evaluación semántica de la alineación curricular (LLM-as-judge con Groq).
// Solo se evalúan factores DERIVABLES DEL CONTENIDO del planeador; los factores externos
// (valoración del testeo, demanda de roles de Cenisoft) se mantienen como prior experto en el front.
// El orden de cada arreglo coincide con DIMENSIONES en src/data/alineacion.js; null = factor externo.
const FACTORES_SEMANTICOS = {
  consultorTech: [
    { id: 'ct0', idx: 0, nombre: 'Interpretar al cliente', desc: 'Comprender necesidades, requisitos y el problema de negocio antes de codificar; interpretar enunciados de problemas cuenta como ejercicio implícito de esta competencia.' },
    { id: 'ct1', idx: 1, nombre: 'Diseñar soluciones', desc: 'Plantear algoritmos, modelos, estructura o arquitectura de la solución.' },
    { id: 'ct2', idx: 2, nombre: 'Comunicar negocio-técnica', desc: 'Presentar, sustentar, explicar o documentar la solución a otros.' },
    { id: 'ct3', idx: 3, nombre: 'Acompañar la implementación', desc: 'Implementar, probar, validar y dar seguimiento a la solución.' },
  ],
  marcoNacional: [
    { id: 'mnc0', idx: 0, nombre: 'Saber (conocimientos)', desc: 'Conceptos, fundamentos y teoría del campo que la materia enseña.' },
    { id: 'mnc1', idx: 1, nombre: 'Saber-hacer (destrezas)', desc: 'Aplicación práctica: desarrollar, construir, resolver, implementar, manejar herramientas.' },
    { id: 'mnc2', idx: 2, nombre: 'Saber-ser (autonomía)', desc: 'Autonomía, responsabilidad, ética y trabajo en equipo.' },
  ],
  empleabilidad: [
    { id: 'emp0', idx: 0, nombre: 'Coincidencia con enfoques demandados', desc: 'Cobertura de las tecnologías más demandadas del mercado: Big Data y analítica, IA, nube, ciberseguridad, full-stack, DevOps.' },
    { id: 'emp3', idx: 3, nombre: 'Vigencia tecnológica y diferenciación', desc: 'Qué tan actuales, vigentes y diferenciadoras son las herramientas y los temas de la materia.' },
  ],
  estrategiaPedagogica: [
    { id: 'ped0', idx: 0, nombre: 'Aprendizaje basado en proyectos', desc: 'Proyectos, retos, casos o productos reales como eje del aprendizaje.' },
    { id: 'ped1', idx: 1, nombre: 'Uso de IA en el aula', desc: 'Uso de inteligencia artificial como herramienta de aprendizaje o de trabajo.' },
    { id: 'ped2', idx: 2, nombre: 'Casos reales / cliente real', desc: 'Escenarios reales, empresas, contexto de negocio o cliente.' },
    { id: 'ped3', idx: 3, nombre: 'Evaluación por evidencias', desc: 'Evaluación por evidencias, rúbricas, seguimiento y portafolio.' },
  ],
};

const TAM_DIM = { consultorTech: 4, marcoNacional: 3, empleabilidad: 4, estrategiaPedagogica: 4 };

function construirCorpus(planeador) {
  return planeador
    .slice()
    .sort((a, b) => (a.semana || 0) - (b.semana || 0))
    .map((w, i) => `S${w.semana || i + 1}: ${[w.tematicas, w.resultadoAprendizaje, w.metodologia, w.observaciones, w.unidadAprendizaje].filter(Boolean).join(' / ')}`)
    .join('\n')
    .trim();
}

function listaFactores() {
  const out = [];
  for (const dim of Object.keys(FACTORES_SEMANTICOS)) {
    for (const f of FACTORES_SEMANTICOS[dim]) out.push(`- ${f.id}: ${f.nombre}. ${f.desc}`);
  }
  return out.join('\n');
}

async function evaluarConGroq(nombreMateria, corpus) {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('Falta GROQ_API_KEY');

  const system = 'Eres un analista curricular experto. Evalúas, leyendo el contenido REAL de un planeador de aula, qué tan presente está cada competencia en una escala de 0 a 100, considerando presencia explícita E implícita (una competencia puede ejercitarse sin nombrarse). Eres riguroso y realista: si el contenido no desarrolla una competencia, asignas un valor bajo aunque el nombre suene relacionado. Respondes ÚNICAMENTE con un objeto JSON.';
  const user = `MATERIA: ${nombreMateria}.

COMPETENCIAS A EVALUAR (id: nombre — definición):
${listaFactores()}

CONTENIDO DEL PLANEADOR (18 semanas):
${corpus}

Devuelve SOLO un objeto JSON con una clave por cada id y un entero de 0 a 100 que represente qué tan presente está esa competencia en el contenido real de la materia. No incluyas texto adicional.`;

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error((data.error && data.error.message) || ('Groq ' + res.status));
  const raw = JSON.parse(data.choices[0].message.content);

  // Reconstruir la estructura por dimensión con null en factores externos.
  const semantica = {};
  for (const dim of Object.keys(TAM_DIM)) {
    semantica[dim] = new Array(TAM_DIM[dim]).fill(null);
    for (const f of (FACTORES_SEMANTICOS[dim] || [])) {
      const v = Number(raw[f.id]);
      if (Number.isFinite(v)) semantica[dim][f.idx] = Math.max(0, Math.min(100, Math.round(v)));
    }
  }
  return { semantica, modelo: data.model || (process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'), tokens: (data.usage && data.usage.total_tokens) || null };
}

module.exports = async (req, res) => {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET');
      return res.status(405).json({ error: 'Método no permitido' });
    }
    const materiaId = (req.query && req.query.materia) || '';
    if (!MATERIAS_VALIDAS.includes(materiaId)) {
      return res.status(400).json({ error: 'materiaId inválido' });
    }

    const db = await getDb();
    const [planeador, materia] = await Promise.all([
      db.collection('planeadores').find({ materiaId }).toArray(),
      db.collection('materias').findOne({ materiaId }),
    ]);
    if (!planeador.length) return res.status(200).json({ semantica: null, fuente: 'experto', motivo: 'sin planeador' });

    const corpus = construirCorpus(planeador);
    const hash = crypto.createHash('sha1').update(corpus).digest('hex');
    const cacheCol = db.collection('alineacion_cache');

    // Caché por (materia, hash): cada contenido del planeador se evalúa UNA sola vez en la vida
    // y siempre devuelve lo mismo, incluso si se revierte a un estado anterior del planeador.
    const cacheado = await cacheCol.findOne({ materiaId, hash });
    if (cacheado && cacheado.semantica) {
      return res.status(200).json({ semantica: cacheado.semantica, fuente: 'semantica', modelo: cacheado.modelo, fecha: cacheado.fecha, cache: true });
    }

    let evaluacion;
    try {
      evaluacion = await evaluarConGroq((materia && materia.nombre) || materiaId, corpus);
    } catch (e) {
      // Degradación elegante: si la IA falla, el front usa el prior experto.
      return res.status(200).json({ semantica: cacheado?.semantica || null, fuente: cacheado?.semantica ? 'semantica-cache' : 'experto', error: e.message });
    }

    const fecha = new Date().toISOString();
    await cacheCol.updateOne(
      { materiaId, hash },
      { $set: { materiaId, hash, semantica: evaluacion.semantica, modelo: evaluacion.modelo, fecha } },
      { upsert: true },
    );
    return res.status(200).json({ semantica: evaluacion.semantica, fuente: 'semantica', modelo: evaluacion.modelo, tokens: evaluacion.tokens, fecha, cache: false });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
