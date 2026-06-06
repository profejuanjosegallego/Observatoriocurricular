const { getDb } = require('../lib/mongo');
const { MATERIAS_VALIDAS } = require('../lib/constants');

const DIMENSIONES = ['consultorTech', 'marcoNacional', 'sectorMedellin', 'empleabilidad', 'innovacionDidactica'];

const BASE = {
  logica:     { consultorTech: 72, marcoNacional: 88, sectorMedellin: 58, empleabilidad: 55, innovacionDidactica: 85 },
  intro:      { consultorTech: 70, marcoNacional: 85, sectorMedellin: 68, empleabilidad: 65, innovacionDidactica: 90 },
  bd:         { consultorTech: 78, marcoNacional: 86, sectorMedellin: 75, empleabilidad: 78, innovacionDidactica: 72 },
  agiles:     { consultorTech: 92, marcoNacional: 82, sectorMedellin: 88, empleabilidad: 82, innovacionDidactica: 95 },
  backend1:   { consultorTech: 80, marcoNacional: 88, sectorMedellin: 90, empleabilidad: 88, innovacionDidactica: 80 },
  frontend1:  { consultorTech: 76, marcoNacional: 84, sectorMedellin: 85, empleabilidad: 85, innovacionDidactica: 88 },
  nuevastec:  { consultorTech: 95, marcoNacional: 78, sectorMedellin: 95, empleabilidad: 85, innovacionDidactica: 92 },
  backend2:   { consultorTech: 88, marcoNacional: 86, sectorMedellin: 92, empleabilidad: 92, innovacionDidactica: 78 },
  frontend2:  { consultorTech: 84, marcoNacional: 84, sectorMedellin: 88, empleabilidad: 90, innovacionDidactica: 85 },
};

const KW = {
  consultorTech: [
    'consultor', 'cliente', 'requerimiento', 'necesidad', 'solucion', 'asesoria',
    'propuesta', 'negocio', 'estrategia', 'diagnostico', 'interpretar', 'socio',
    'acompanamiento', 'servicio', 'valor', 'comunicacion',
  ],
  marcoNacional: [
    'competencia', 'resultado de aprendizaje', 'saber', 'cualificacion', 'descriptor',
    'evidencia', 'criterio', 'evaluacion', 'formacion', 'tecnico laboral', 'nivel',
    'autonomia', 'responsabilidad',
  ],
  sectorMedellin: [
    'cloud', 'nube', 'inteligencia artificial', ' ia ', 'machine learning', 'devops',
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'seguridad', 'ciberseguridad',
    'fullstack', 'full-stack', 'full stack', 'react', 'node', 'python', 'javascript',
    'agil', 'scrum', ' api ', 'rest', 'microservicio', 'ci/cd', 'git', 'despliegue',
    'deploy', 'contenedor', 'serverless', 'datos', 'data',
  ],
  empleabilidad: [
    'proyecto', 'portafolio', 'industria', 'empresa', 'laboral', 'profesional',
    'mercado', 'empleo', 'practica', 'aplicacion real', 'produccion', 'equipo',
    'colaboracion', 'entrega', 'sprint', 'producto', 'funcional', 'entregable',
  ],
  innovacionDidactica: [
    'abp', 'gamificacion', 'invertida', 'flipped', 'pair programming', 'parejas',
    'design thinking', 'hackathon', 'microlearning', 'colaborativo', 'creativo',
    'innovacion', 'taller', 'simulacion', 'reto', 'desafio', 'prototipo', 'iterativo',
  ],
};

function norm(text) {
  return (' ' + (text || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s\/\-]/g, ' ') + ' ');
}

function keywordScore(text, keywords) {
  if (!text) return 0;
  const n = norm(text);
  let hits = 0;
  for (const kw of keywords) {
    const nk = norm(kw).trim();
    let idx = -1;
    while ((idx = n.indexOf(nk, idx + 1)) !== -1) hits++;
  }
  return hits;
}

function buildText(aportes, planeador, materia) {
  const parts = [];
  for (const a of aportes) {
    parts.push(a.comprension, a.saber, a.saberHacer, a.saberSer);
  }
  for (const p of planeador) {
    parts.push(p.tematicas, p.resultado, p.metodologia, p.observaciones);
    if (p.tematicasDetalle) {
      for (const t of p.tematicasDetalle) parts.push(t.texto);
    }
  }
  if (materia) {
    parts.push(materia.proposito, materia.objetivo, materia.competencia);
    parts.push(materia.relacionPerfilEgreso, materia.relacionConsultorTech);
    parts.push(materia.definicionSintesis);
  }
  return parts.filter(Boolean).join(' ');
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

    const base = BASE[materiaId];
    if (!base) return res.status(400).json({ error: 'Sin datos base' });

    const db = await getDb();
    const [aportes, planeador, materia] = await Promise.all([
      db.collection('aportes').find({ materiaId }).toArray(),
      db.collection('planeadores').find({ materiaId }).toArray(),
      db.collection('materias').findOne({ materiaId }),
    ]);

    const semanasConContenido = planeador.filter(p => p.tematicas && p.tematicas.trim()).length;
    const planeadorPct = semanasConContenido / 18;
    const aportesPct = Math.min(aportes.length / 3, 1.0);
    const hasSintesis = !!(materia && materia.definicionSintesis);
    const cobertura = (planeadorPct * 0.4) + (aportesPct * 0.3) + (hasSintesis ? 0.3 : 0);

    const allText = buildText(aportes, planeador, materia);
    const aiScores = (materia && materia.alineacionIA) || null;

    const scores = {};
    let fuente = 'bibliográfica';

    for (const dim of DIMENSIONES) {
      let score = base[dim];

      const coverageAdj = Math.round((cobertura - 0.5) * 16);
      score += coverageAdj;

      const hits = keywordScore(allText, KW[dim]);
      const relevanceAdj = Math.min(8, Math.round(hits / 4)) - 2;
      score += relevanceAdj;

      if (aiScores && typeof aiScores[dim] === 'number') {
        score = Math.round(score * 0.35 + aiScores[dim] * 0.65);
        fuente = 'integral';
      } else if (allText.length > 200) {
        fuente = fuente === 'integral' ? 'integral' : 'heurística';
      }

      scores[dim] = Math.max(0, Math.min(100, Math.round(score)));
    }

    return res.status(200).json({
      scores,
      fuente,
      detalle: {
        aportes: aportes.length,
        semanasPlaneador: semanasConContenido,
        tieneSintesis: hasSintesis,
        tieneIA: !!aiScores,
        cobertura: Math.round(cobertura * 100),
      },
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
