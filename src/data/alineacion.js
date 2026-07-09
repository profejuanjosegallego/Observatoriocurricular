// Modelo de cálculo transparente (rúbrica ponderada).
// Cada dimensión tiene factores con un peso (los pesos de una dimensión suman 100).
// La valoración 0-100 de cada factor por materia vive en ALINEACION_FACTORES.
// Puntaje de la dimensión = Σ (valoración del factor × peso) ÷ 100  → ver calcularDimension().
export const DIMENSIONES = [
  {
    key: 'consultorTech',
    nombre: 'Perfil Consultor Tech',
    corto: 'Consultor Tech',
    desc: 'Mide qué tanto la materia desarrolla el perfil de Consultor Tech: interpretar al cliente, diseñar soluciones y acompañar su implementación, más allá de solo programar.',
    porque: 'Es el eje central de la iniciativa del programa; cada materia debe aportar a esta transformación profesional.',
    calculo: 'Suma ponderada de cuatro pilares del Consultor Tech (interpretar, diseñar, comunicar y acompañar). Cada pilar se valora de 0 a 100 según su presencia en las unidades, didácticas y el testeo empresarial, y se multiplica por su peso.',
    porquePesos: 'Los cuatro pilares del Consultor Tech son igualmente constitutivos del perfil: ninguno predomina sobre otro para formar al intérprete-arquitecto-socio. Por eso reparten el 100 % en partes iguales (25 % cada uno).',
    metodologia: {
      tecnica: 'Minería de texto con vocabulario controlado (term matching) + triangulación con el panel empresarial',
      descripcion: 'Se tokeniza y normaliza el corpus de la materia (minúsculas, sin tildes ni signos) y se mide la frecuencia de términos (term frequency) del léxico asociado a cada pilar. La densidad léxica se contrasta con la valoración del panel de expertos para corregir sesgos del texto.',
      corpus: 'Planeador FTCOCU-237 (temáticas, resultados de aprendizaje, metodología y observaciones), aportes docentes y definición de síntesis curricular.',
      vocabulario: ['cliente', 'requerimiento', 'necesidad', 'solución', 'propuesta', 'negocio', 'diagnóstico', 'interpretar', 'acompañamiento', 'comunicación'],
    },
    factores: [
      { nombre: 'Interpretar al cliente', peso: 25 },
      { nombre: 'Diseñar soluciones', peso: 25 },
      { nombre: 'Comunicar negocio-técnica', peso: 25 },
      { nombre: 'Acompañar la implementación', peso: 25 },
    ],
    mejoras: [
      'Incluir un cliente o stakeholder real en el proyecto integrador para practicar interpretación y acompañamiento.',
      'Agregar entregables donde el estudiante traduzca requisitos de negocio a una solución técnica.',
      'Evaluar la comunicación con el cliente, no solo el código entregado.',
    ],
    fuentes: [
      { nombre: 'Iniciativa Consultor Tech — CESDE', url: null },
      { nombre: 'Testeo empresarial (CESDE–Comfama, 2026)', url: null },
    ],
  },
  {
    key: 'marcoNacional',
    nombre: 'Marco Nacional (MNC)',
    corto: 'MNC',
    desc: 'Grado de correspondencia de la materia con los descriptores del Marco Nacional de Cualificaciones (saber, saber-hacer y saber-ser) para los niveles 2 y 3.',
    porque: 'La pertinencia curricular se valida contra la normativa nacional vigente (Decreto 1649 de 2021).',
    calculo: 'Suma ponderada de la cobertura de los tres descriptores del MNC (saber, saber-hacer y saber-ser). Cada descriptor se valora de 0 a 100 según cuánto lo cubren las unidades de la materia y se multiplica por su peso.',
    porquePesos: 'Se da más peso al saber-hacer (40 %) porque el MNC, en formación técnica laboral (niveles 2-3), prioriza las destrezas aplicadas sobre la teoría. El saber (35 %) las sustenta y el saber-ser (25 %) aporta la autonomía y responsabilidad, descriptores presentes pero de menor extensión en este nivel.',
    metodologia: {
      tecnica: 'Mapeo semántico contra descriptores del MNC + cobertura léxica por descriptor',
      descripcion: 'Se contrastan las unidades de la materia con los descriptores de nivel del MNC mediante coincidencia terminológica clasificada en las tres categorías (saber, saber-hacer, saber-ser) y se calcula la razón de cobertura (coverage ratio) de cada categoría.',
      corpus: 'Planeador FTCOCU-237 y competencias declaradas; contraste normativo con los descriptores del MNC (Decreto 1649/2021) y la ocupación 25120 del CUOC 2025 (DANE).',
      vocabulario: ['competencia', 'resultado de aprendizaje', 'saber', 'cualificación', 'descriptor', 'evidencia', 'criterio', 'evaluación', 'autonomía', 'responsabilidad'],
    },
    factores: [
      { nombre: 'Saber (conocimientos)', peso: 35 },
      { nombre: 'Saber-hacer (destrezas)', peso: 40 },
      { nombre: 'Saber-ser (autonomía)', peso: 25 },
    ],
    mejoras: [
      'Mapear cada unidad de aprendizaje con los descriptores del nivel MNC y cubrir los faltantes.',
      'Reforzar el saber-ser (autonomía y responsabilidad) con rúbricas explícitas.',
      'Documentar evidencias de saber-hacer alineadas al Catálogo Nacional de Cualificaciones.',
    ],
    fuentes: [
      { nombre: 'Marco Nacional de Cualificaciones — Colombia Aprende', url: 'https://especiales.colombiaaprende.edu.co/mnc/index.html' },
      { nombre: 'Estructura y niveles del MNC', url: 'https://especiales.colombiaaprende.edu.co/mnc/estructura.html' },
      { nombre: 'Decreto 923 de 2024 — Formación para el trabajo', url: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=245116' },
      { nombre: 'DANE — CUOC 2025, ocupación 25120 Desarrolladores de software', url: 'https://clasificaciones.dane.gov.co/cuoc/grupo_primario/98/ficha/' },
    ],
  },
  {
    key: 'empleabilidad',
    nombre: 'Empleabilidad',
    corto: 'Empleabilidad',
    desc: 'Integra la coincidencia de la materia con los enfoques TI más demandados del mercado y su traducción en inserción laboral directa del egresado. Fusiona en un solo indicador la mirada del sector TI y la empleabilidad.',
    porque: 'La formación técnica laboral debe responder a la demanda real del mercado y traducirse en empleo efectivo del egresado.',
    calculo: 'Suma ponderada de cuatro factores valorados de 0 a 100: coincidencia con los enfoques más demandados según Cenisoft 2025 (Big Data 50 %, IA 47 %, nube 43 %, ciberseguridad 41 %, full-stack 38 %, DevOps 36 %), demanda de roles laborales, valoración del testeo empresarial y vigencia tecnológica con diferenciación en el mercado.',
    porquePesos: 'La coincidencia con la demanda real del mercado (Cenisoft 2025) lidera con 30 % por ser la evidencia más amplia (más de 310.000 vacantes). La demanda de roles y la valoración del testeo empresarial pesan 25 % cada una por su evidencia directa pero de muestra menor. La vigencia tecnológica y la diferenciación cierran con 20 % por ser un factor de contexto más que de inserción inmediata.',
    metodologia: {
      tecnica: 'Coincidencia de habilidades (skill matching) ponderada por prevalencia de la demanda + triangulación con testeo',
      descripcion: 'Se extrae el vocabulario técnico de la materia y se calcula su coincidencia con los enfoques más demandados, ponderando cada coincidencia por la prevalencia del enfoque en las vacantes (p. ej. Big Data 50 %, IA 47 %, nube 43 %). El resultado se ajusta con la valoración del testeo empresarial.',
      corpus: 'Planeador FTCOCU-237 (temáticas y herramientas) y aportes docentes. Benchmark externo: Estudio Cenisoft 2025 — más de 310.000 vacantes procesadas con NLP, modelos de embeddings y reducción de dimensionalidad (PCA) — y testeo con 8 empresas del sector.',
      vocabulario: ['cloud', 'nube', 'inteligencia artificial', 'machine learning', 'devops', 'ciberseguridad', 'full-stack', 'api', 'datos', 'analítica', 'ci/cd', 'despliegue'],
    },
    factores: [
      { nombre: 'Coincidencia con enfoques más demandados (Cenisoft 2025)', peso: 30 },
      { nombre: 'Demanda de roles laborales', peso: 25 },
      { nombre: 'Valoración del testeo empresarial', peso: 25 },
      { nombre: 'Vigencia tecnológica y diferenciación', peso: 20 },
    ],
    mejoras: [
      'Actualizar las herramientas de la materia a los enfoques más demandados (Big Data y analítica, IA, nube, ciberseguridad, DevOps).',
      'Alinear los entregables con tareas reales de los roles junior que demanda el mercado.',
      'Incluir un portafolio o proyecto demostrable que el egresado pueda mostrar al postularse.',
      'Reforzar la comunicación, el trabajo en equipo y el inglés técnico, brechas blandas críticas según Cenisoft 2025.',
    ],
    fuentes: [
      { nombre: 'Estudio de Empleabilidad y Talento Digital — Colombia 2025 (Cenisoft)', url: 'https://cenisoft.org/estudioempleabilidadti/' },
      { nombre: 'Testeo con 8 empresas del sector TI (CESDE–Comfama, 2026)', url: null },
      { nombre: 'Ruta N — Ecosistema de innovación Medellín', url: 'https://rutanmedellin.org/' },
      { nombre: 'MinTIC — Talento Tech Colombia', url: 'https://talentodigital.mintic.gov.co/' },
    ],
  },
  {
    key: 'estrategiaPedagogica',
    nombre: 'Estrategia pedagógica',
    corto: 'Estrategia pedagógica',
    desc: 'Calidad y pertinencia del diseño de la enseñanza: aprendizaje basado en proyectos, uso de IA en el aula, casos reales con cliente y evaluación por evidencias.',
    porque: 'La forma de enseñar es tan determinante como el contenido para formar consultores tecnológicos.',
    calculo: 'Suma ponderada de cuatro estrategias didácticas valoradas de 0 a 100 (aprendizaje basado en proyectos, uso de IA en el aula, casos reales y evaluación por evidencias), cada una multiplicada por su peso.',
    porquePesos: 'El aprendizaje basado en proyectos (30 %) es la estrategia de mayor impacto formativo y eje de la estructura didáctica FTCOCU-236. El uso de IA en el aula y los casos reales (25 % cada uno) son los diferenciadores que pide el panel de pertinencia. La evaluación por evidencias (20 %) asegura la validez del aprendizaje, como cierre del proceso.',
    metodologia: {
      tecnica: 'Detección de estrategias activas por coincidencia léxica + ponderación por impacto formativo',
      descripcion: 'Se identifican en la planeación las marcas léxicas de estrategias didácticas activas mediante minería de texto y se ponderan según su impacto formativo declarado en la estructura didáctica, normalizando por número de semanas con estrategia registrada.',
      corpus: 'Planeador FTCOCU-237 (metodología y observaciones), estructura didáctica FTCOCU-236 y panel de pertinencia curricular.',
      vocabulario: ['abp', 'proyecto', 'aula invertida', 'pair programming', 'design thinking', 'reto', 'prototipo', 'simulación', 'rúbrica', 'evidencia'],
    },
    factores: [
      { nombre: 'Aprendizaje basado en proyectos', peso: 30 },
      { nombre: 'Uso de IA en el aula', peso: 25 },
      { nombre: 'Casos reales / cliente real', peso: 25 },
      { nombre: 'Evaluación por evidencias', peso: 20 },
    ],
    mejoras: [
      'Adoptar aprendizaje basado en proyectos con un caso real por nivel.',
      'Integrar IA en el aula: programación asistida, prompting y auditoría de resultados.',
      'Reemplazar exámenes memorísticos por evaluación por evidencias.',
    ],
    fuentes: [
      { nombre: 'Estructura didáctica FTCOCU-236 — CESDE', url: null },
      { nombre: 'Panel de expertos de pertinencia — CESDE', url: null },
    ],
  },
];

// Valoración 0-100 de cada factor por materia.
// El orden de cada arreglo coincide con el orden de los factores de su dimensión en DIMENSIONES.
export const ALINEACION_FACTORES = {
  logica: {
    consultorTech: [70, 78, 80, 72],
    marcoNacional: [92, 90, 88],
    empleabilidad: [60, 58, 60, 62],
    estrategiaPedagogica: [82, 80, 82, 84],
  },
  intro: {
    consultorTech: [62, 68, 70, 60],
    marcoNacional: [82, 80, 78],
    empleabilidad: [56, 54, 55, 56],
    estrategiaPedagogica: [86, 84, 84, 86],
  },
  bd: {
    consultorTech: [80, 82, 82, 76],
    marcoNacional: [90, 88, 85],
    empleabilidad: [85, 82, 82, 82],
    estrategiaPedagogica: [72, 70, 74, 72],
  },
  agiles: {
    consultorTech: [90, 86, 90, 86],
    marcoNacional: [80, 84, 80],
    empleabilidad: [70, 66, 68, 68],
    estrategiaPedagogica: [92, 88, 90, 90],
  },
  backend1: {
    consultorTech: [78, 80, 78, 76],
    marcoNacional: [88, 90, 84],
    empleabilidad: [82, 78, 80, 80],
    estrategiaPedagogica: [76, 74, 74, 76],
  },
  frontend1: {
    consultorTech: [70, 74, 74, 70],
    marcoNacional: [84, 86, 80],
    empleabilidad: [76, 74, 75, 76],
    estrategiaPedagogica: [82, 82, 82, 82],
  },
  nuevastec: {
    consultorTech: [94, 92, 92, 90],
    marcoNacional: [78, 76, 72],
    empleabilidad: [92, 86, 88, 90],
    estrategiaPedagogica: [90, 92, 88, 90],
  },
  backend2: {
    consultorTech: [86, 84, 86, 84],
    marcoNacional: [84, 86, 80],
    empleabilidad: [80, 74, 76, 80],
    estrategiaPedagogica: [74, 72, 76, 74],
  },
  frontend2: {
    consultorTech: [82, 82, 84, 80],
    marcoNacional: [82, 84, 78],
    empleabilidad: [74, 75, 75, 74],
    estrategiaPedagogica: [78, 78, 78, 78],
  },
};

// Calcula el puntaje de una dimensión: Σ (valoración × peso) ÷ 100.
// Los pesos de cada dimensión suman 100, por lo que el resultado es un promedio ponderado en escala 0-100.
export function calcularDimension(valores, factores) {
  if (!valores || !factores || !valores.length) return 0;
  const total = factores.reduce((suma, f, i) => suma + (valores[i] || 0) * f.peso, 0);
  return Math.round(total / 100);
}

// Peso de la evaluación semántica (IA) frente al prior experto en el puntaje final.
export const ALPHA_SEMANTICA = 0.5;

// Combina el prior experto con la señal semántica (IA). Si no hay señal (factor externo), usa el experto.
export function valorFactor(experto, semantico) {
  if (semantico == null || semantico === undefined) return experto || 0;
  return Math.round(ALPHA_SEMANTICA * semantico + (1 - ALPHA_SEMANTICA) * (experto || 0));
}

// Genera el sustento textual de un valor a partir de la evidencia léxica real del planeador.
// Hace explícito el "por qué de este valor": muestra el dato medido y cómo se interpreta.
export function sustentoFactor({ experto, semantico, valoracion, ev, semDisponible }) {
  // La evaluación de IA aún no cargó (o falló): se muestra el prior experto.
  if (!semDisponible) {
    return `Por ahora se muestra el valor del criterio experto (${experto}%); la evaluación con IA se está cargando.`;
  }
  // Factor externo (no derivable del planeador): se mantiene el prior experto.
  if (semantico == null || semantico === undefined) {
    return `Es un factor externo (testeo empresarial y demanda del estudio Cenisoft); no se lee del planeador, por eso conserva el valor del criterio experto (${experto}%).`;
  }
  let comp = `El valor combina, a partes iguales (α ${ALPHA_SEMANTICA}), la lectura de la IA sobre el planeador (${semantico}%) y el criterio experto (${experto}%): ${semantico} × 0.5 + ${experto} × 0.5 = ${valoracion}%.`;
  if (ev) {
    const terms = ev.terminos && ev.terminos.length ? ` (${ev.terminos.slice(0, 3).join(', ')})` : '';
    comp += ` La verificación léxica halló ese vocabulario en ${ev.semanas} de 18 semanas${terms}, lo que respalda la coherencia.`;
  }
  return comp;
}

// Devuelve el desglose de una dimensión para una materia: factor, peso, valoración, aporte,
// evidencia léxica medida en el planeador y el sustento que la interpreta.
export function desglosarDimension(materiaId, dimKey, opts = {}) {
  const { evidenciaLive, semantica } = opts;
  const dim = DIMENSIONES.find(d => d.key === dimKey);
  const expertos = ALINEACION_FACTORES[materiaId]?.[dimKey];
  if (!dim || !expertos) return null;
  const fuenteEv = evidenciaLive || ALINEACION_EVIDENCIA[materiaId] || {};
  const evid = fuenteEv[dimKey] || [];
  const semDisponible = !!semantica;
  const sem = (semantica && semantica[dimKey]) || [];
  const filas = dim.factores.map((f, i) => {
    const experto = expertos[i] || 0;
    const semantico = sem[i] != null ? sem[i] : null;
    const valoracion = valorFactor(experto, semantico);
    const ev = evid[i] || null;
    return {
      nombre: f.nombre,
      peso: f.peso,
      experto,
      semantico,
      valoracion,
      aporte: (valoracion * f.peso) / 100,
      evidencia: ev,
      sustento: sustentoFactor({ experto, semantico, valoracion, ev, semDisponible }),
    };
  });
  return { filas, total: calcularDimension(filas.map(r => r.valoracion), dim.factores) };
}

// Calcula todos los puntajes de una materia a partir de su rúbrica de factores.
export function calcularAlineacion(materiaId, semantica) {
  const fact = ALINEACION_FACTORES[materiaId];
  if (!fact) return null;
  const out = {};
  for (const dim of DIMENSIONES) {
    const exp = fact[dim.key] || [];
    const sem = (semantica && semantica[dim.key]) || [];
    const blended = exp.map((v, i) => valorFactor(v, sem[i] != null ? sem[i] : null));
    out[dim.key] = calcularDimension(blended, dim.factores);
  }
  return out;
}

// Puntajes finales por materia, derivados (no escritos a mano) de ALINEACION_FACTORES.
export const ALINEACION = Object.fromEntries(
  Object.keys(ALINEACION_FACTORES).map(id => [id, calcularAlineacion(id)])
);

// Escala de valoración: define qué significa cada rango de valor (0-100) de un factor.
// Hace transparente "por qué 70 y no otro valor": el número ubica al factor en una banda con criterio explícito.
export const ESCALA_VALORACION = [
  { min: 90, max: 100, etiqueta: 'Eje estructural', color: '#E6007E', criterio: 'El factor es un eje explícito de la materia: se trabaja en varias unidades y se evalúa de forma directa.' },
  { min: 75, max: 89, etiqueta: 'Presencia fuerte', color: '#ff4fb0', criterio: 'El factor se trabaja de forma consistente y deliberada a lo largo de la materia.' },
  { min: 60, max: 74, etiqueta: 'Presencia parcial', color: '#ff84c8', criterio: 'El factor se aborda, pero de forma implícita o sin ser el eje central de la materia.' },
  { min: 45, max: 59, etiqueta: 'Presencia incipiente', color: '#f7b8db', criterio: 'El factor aparece de manera tangencial o apenas emergente.' },
  { min: 0, max: 44, etiqueta: 'Ausente o marginal', color: '#f3d4e6', criterio: 'El factor casi no se trabaja en la materia.' },
];

// Devuelve la banda de la escala a la que pertenece un valor.
export function bandaDe(valor) {
  return ESCALA_VALORACION.find(b => valor >= b.min && valor <= b.max) || ESCALA_VALORACION[ESCALA_VALORACION.length - 1];
}

// Evidencia léxica MEDIDA sobre el corpus real del planeador (18 semanas por materia).
// Por factor: señal = % de semanas donde aparece el vocabulario controlado; semanas = nº de semanas con coincidencia;
// hits = apariciones totales; terminos = términos del vocabulario efectivamente hallados.
// Generado con scripts/calcular-evidencia-alineacion.mjs (análisis de coincidencia léxica con normalización).
export const ALINEACION_EVIDENCIA = {
  logica: {
    consultorTech: [{ senal: 6, semanas: 1, hits: 1, terminos: ['necesidad'] }, { senal: 89, semanas: 16, hits: 28, terminos: ['algoritmo', 'estructura'] }, { senal: 6, semanas: 1, hits: 1, terminos: ['presentación'] }, { senal: 39, semanas: 7, hits: 9, terminos: ['proyecto integrador', 'implementar', 'seguimiento'] }],
    marcoNacional: [{ senal: 17, semanas: 3, hits: 5, terminos: ['concepto', 'teoria', 'teoría'] }, { senal: 89, semanas: 16, hits: 16, terminos: ['utilizar', 'implementar'] }, { senal: 17, semanas: 3, hits: 5, terminos: ['pacto', 'etica', 'ética'] }],
    empleabilidad: [{ senal: 11, semanas: 2, hits: 2, terminos: ['datos'] }, { senal: 6, semanas: 1, hits: 2, terminos: ['empresa', 'empresarial'] }, { senal: 22, semanas: 4, hits: 8, terminos: ['proyecto integrador', 'reto', 'evidencia'] }, { senal: 0, semanas: 0, hits: 0, terminos: [] }],
    estrategiaPedagogica: [{ senal: 22, semanas: 4, hits: 8, terminos: ['proyecto', 'proyecto integrador', 'reto'] }, { senal: 50, semanas: 9, hits: 14, terminos: ['ia'] }, { senal: 6, semanas: 1, hits: 1, terminos: ['empresa'] }, { senal: 17, semanas: 3, hits: 18, terminos: ['evidencia', 'evaluacion', 'evaluación', 'seguimiento', 'recoleccion'] }],
  },
  intro: {
    consultorTech: [{ senal: 67, semanas: 12, hits: 14, terminos: ['comprender', 'usuario'] }, { senal: 22, semanas: 4, hits: 5, terminos: ['estructura', 'diseño'] }, { senal: 6, semanas: 1, hits: 1, terminos: ['presentación'] }, { senal: 17, semanas: 3, hits: 5, terminos: ['proyecto integrador', 'seguimiento'] }],
    marcoNacional: [{ senal: 44, semanas: 8, hits: 8, terminos: ['conocer', 'identificar', 'concepto'] }, { senal: 44, semanas: 8, hits: 11, terminos: ['aplicar', 'crear', 'realizar', 'utilizar'] }, { senal: 6, semanas: 1, hits: 1, terminos: ['pacto'] }],
    empleabilidad: [{ senal: 6, semanas: 1, hits: 1, terminos: ['contenedor'] }, { senal: 28, semanas: 5, hits: 6, terminos: ['empresa', 'empresarial', 'laboral', 'rol'] }, { senal: 33, semanas: 6, hits: 10, terminos: ['proyecto integrador', 'reto', 'evidencia'] }, { senal: 6, semanas: 1, hits: 1, terminos: ['herramienta'] }],
    estrategiaPedagogica: [{ senal: 33, semanas: 6, hits: 11, terminos: ['proyecto', 'proyecto integrador', 'reto'] }, { senal: 100, semanas: 18, hits: 40, terminos: ['ia'] }, { senal: 17, semanas: 3, hits: 3, terminos: ['empresa', 'real'] }, { senal: 28, semanas: 5, hits: 14, terminos: ['evidencia', 'seguimiento', 'recoleccion', 'recolección'] }],
  },
  bd: {
    consultorTech: [{ senal: 39, semanas: 7, hits: 9, terminos: ['comprender', 'requisito', 'negocio', 'contexto', 'usuario'] }, { senal: 44, semanas: 8, hits: 16, terminos: ['diseño', 'modelo', 'estructura', 'diseñar'] }, { senal: 28, semanas: 5, hits: 11, terminos: ['presentación', 'explicar', 'documentar', 'informe'] }, { senal: 22, semanas: 4, hits: 6, terminos: ['proyecto integrador', 'seguimiento', 'implementación'] }],
    marcoNacional: [{ senal: 28, semanas: 5, hits: 10, terminos: ['concepto', 'tipos', 'principio', 'fundamento', 'conocer'] }, { senal: 67, semanas: 12, hits: 25, terminos: ['aplicar', 'ejercicio', 'desarrollar', 'crear', 'manejar'] }, { senal: 28, semanas: 5, hits: 5, terminos: ['pacto', 'colaborativo'] }],
    empleabilidad: [{ senal: 100, semanas: 18, hits: 91, terminos: ['datos', 'sql', 'seguridad'] }, { senal: 39, semanas: 7, hits: 11, terminos: ['empresa', 'empresarial', 'rol'] }, { senal: 33, semanas: 6, hits: 10, terminos: ['proyecto integrador', 'reto', 'evidencia'] }, { senal: 28, semanas: 5, hits: 7, terminos: ['actual', 'herramienta'] }],
    estrategiaPedagogica: [{ senal: 39, semanas: 7, hits: 12, terminos: ['proyecto', 'proyecto integrador', 'reto'] }, { senal: 94, semanas: 17, hits: 49, terminos: ['ia'] }, { senal: 56, semanas: 10, hits: 12, terminos: ['empresa', 'real', 'negocio', 'contexto', 'escenario'] }, { senal: 28, semanas: 5, hits: 14, terminos: ['evidencia', 'seguimiento', 'recoleccion', 'recolección'] }],
  },
  agiles: {
    consultorTech: [{ senal: 83, semanas: 15, hits: 25, terminos: ['contexto', 'usuario', 'negocio', 'requisito', 'comprender'] }, { senal: 44, semanas: 8, hits: 13, terminos: ['estructura', 'diseño', 'solucion', 'solución'] }, { senal: 6, semanas: 1, hits: 1, terminos: ['presentación'] }, { senal: 17, semanas: 3, hits: 5, terminos: ['proyecto integrador', 'seguimiento'] }],
    marcoNacional: [{ senal: 50, semanas: 9, hits: 15, terminos: ['principio', 'tipos', 'concepto', 'conocer'] }, { senal: 17, semanas: 3, hits: 3, terminos: ['realizar'] }, { senal: 11, semanas: 2, hits: 2, terminos: ['pacto', 'responsabilidad'] }],
    empleabilidad: [{ senal: 17, semanas: 3, hits: 3, terminos: ['datos', 'seguridad'] }, { senal: 33, semanas: 6, hits: 10, terminos: ['empresa', 'empresarial', 'rol'] }, { senal: 33, semanas: 6, hits: 10, terminos: ['proyecto integrador', 'reto', 'evidencia'] }, { senal: 17, semanas: 3, hits: 6, terminos: ['herramienta'] }],
    estrategiaPedagogica: [{ senal: 50, semanas: 9, hits: 14, terminos: ['proyecto', 'proyecto integrador', 'reto', 'caso'] }, { senal: 94, semanas: 17, hits: 44, terminos: ['ia'] }, { senal: 72, semanas: 13, hits: 18, terminos: ['empresa', 'real', 'contexto', 'negocio'] }, { senal: 28, semanas: 5, hits: 14, terminos: ['evidencia', 'seguimiento', 'recoleccion', 'recolección'] }],
  },
  backend1: {
    consultorTech: [{ senal: 33, semanas: 6, hits: 7, terminos: ['comprender', 'caso', 'negocio'] }, { senal: 28, semanas: 5, hits: 7, terminos: ['estructura', 'diseñar'] }, { senal: 6, semanas: 1, hits: 1, terminos: ['presentación'] }, { senal: 28, semanas: 5, hits: 8, terminos: ['proyecto integrador', 'seguimiento', 'implementar', 'implementación'] }],
    marcoNacional: [{ senal: 39, semanas: 7, hits: 15, terminos: ['fundamento', 'concepto', 'conocer', 'identificar'] }, { senal: 56, semanas: 10, hits: 14, terminos: ['utilizar', 'realizar', 'manejar', 'implementar'] }, { senal: 28, semanas: 5, hits: 7, terminos: ['pacto', 'colaborativo', 'responsabilidad'] }],
    empleabilidad: [{ senal: 11, semanas: 2, hits: 2, terminos: ['datos'] }, { senal: 67, semanas: 12, hits: 13, terminos: ['empresa', 'empresarial', 'rol'] }, { senal: 33, semanas: 6, hits: 10, terminos: ['proyecto integrador', 'reto', 'evidencia'] }, { senal: 0, semanas: 0, hits: 0, terminos: [] }],
    estrategiaPedagogica: [{ senal: 89, semanas: 16, hits: 23, terminos: ['proyecto', 'proyecto integrador', 'reto', 'caso'] }, { senal: 100, semanas: 18, hits: 33, terminos: ['ia'] }, { senal: 61, semanas: 11, hits: 13, terminos: ['empresa', 'negocio', 'real'] }, { senal: 17, semanas: 3, hits: 12, terminos: ['evidencia', 'seguimiento', 'recoleccion', 'recolección'] }],
  },
  frontend1: {
    consultorTech: [{ senal: 17, semanas: 3, hits: 3, terminos: ['problema', 'comprender'] }, { senal: 28, semanas: 5, hits: 11, terminos: ['solucion', 'solución', 'estructura', 'diseñar'] }, { senal: 6, semanas: 1, hits: 1, terminos: ['presentación'] }, { senal: 17, semanas: 3, hits: 5, terminos: ['proyecto integrador', 'seguimiento'] }],
    marcoNacional: [{ senal: 28, semanas: 5, hits: 5, terminos: ['concepto', 'identificar'] }, { senal: 39, semanas: 7, hits: 8, terminos: ['utilizar', 'resolver', 'desarrollar'] }, { senal: 28, semanas: 5, hits: 5, terminos: ['pacto', 'colaborativo'] }],
    empleabilidad: [{ senal: 22, semanas: 4, hits: 5, terminos: ['datos', 'api'] }, { senal: 28, semanas: 5, hits: 6, terminos: ['empresa', 'empresarial', 'rol'] }, { senal: 28, semanas: 5, hits: 9, terminos: ['proyecto integrador', 'reto', 'funcional', 'evidencia'] }, { senal: 0, semanas: 0, hits: 0, terminos: [] }],
    estrategiaPedagogica: [{ senal: 89, semanas: 16, hits: 21, terminos: ['proyecto', 'proyecto integrador', 'reto', 'problema'] }, { senal: 44, semanas: 8, hits: 10, terminos: ['ia'] }, { senal: 11, semanas: 2, hits: 2, terminos: ['empresa', 'real'] }, { senal: 17, semanas: 3, hits: 12, terminos: ['evidencia', 'seguimiento', 'recoleccion', 'recolección'] }],
  },
  nuevastec: {
    consultorTech: [{ senal: 50, semanas: 9, hits: 12, terminos: ['usuario', 'problema', 'caso', 'requerimiento'] }, { senal: 50, semanas: 9, hits: 12, terminos: ['solucion', 'solución', 'estructura', 'diseñar'] }, { senal: 39, semanas: 7, hits: 7, terminos: ['presentación', 'documentar', 'comunicar'] }, { senal: 17, semanas: 3, hits: 5, terminos: ['proyecto integrador', 'seguimiento'] }],
    marcoNacional: [{ senal: 39, semanas: 7, hits: 10, terminos: ['identificar', 'concepto', 'tipos'] }, { senal: 11, semanas: 2, hits: 2, terminos: ['crear'] }, { senal: 28, semanas: 5, hits: 5, terminos: ['pacto', 'colaborativo'] }],
    empleabilidad: [{ senal: 89, semanas: 16, hits: 68, terminos: ['datos', 'python', 'nube', 'analitica', 'analítica'] }, { senal: 17, semanas: 3, hits: 6, terminos: ['rol'] }, { senal: 50, semanas: 9, hits: 12, terminos: ['proyecto integrador', 'reto', 'funcional', 'evidencia'] }, { senal: 28, semanas: 5, hits: 13, terminos: ['herramienta', 'tendencia'] }],
    estrategiaPedagogica: [{ senal: 100, semanas: 18, hits: 27, terminos: ['proyecto', 'proyecto integrador', 'reto', 'problema', 'caso'] }, { senal: 100, semanas: 18, hits: 71, terminos: ['ia'] }, { senal: 0, semanas: 0, hits: 0, terminos: [] }, { senal: 39, semanas: 7, hits: 18, terminos: ['evaluacion', 'evaluación', 'evidencia', 'seguimiento', 'recoleccion'] }],
  },
  backend2: {
    consultorTech: [{ senal: 17, semanas: 3, hits: 4, terminos: ['cliente', 'negocio'] }, { senal: 44, semanas: 8, hits: 21, terminos: ['modelo', 'arquitectura', 'estructura', 'diseñar', 'diseño'] }, { senal: 22, semanas: 4, hits: 7, terminos: ['presentación', 'exponer', 'documentar'] }, { senal: 89, semanas: 16, hits: 25, terminos: ['proyecto integrador', 'implementar', 'seguimiento', 'implementación', 'prueba'] }],
    marcoNacional: [{ senal: 28, semanas: 5, hits: 7, terminos: ['conocer', 'concepto', 'principio', 'tipos'] }, { senal: 33, semanas: 6, hits: 8, terminos: ['implementar', 'realizar', 'construir'] }, { senal: 28, semanas: 5, hits: 5, terminos: ['pacto', 'colaborativo'] }],
    empleabilidad: [{ senal: 44, semanas: 8, hits: 21, terminos: ['api', 'datos'] }, { senal: 22, semanas: 4, hits: 17, terminos: ['empresa', 'empresarial', 'rol'] }, { senal: 22, semanas: 4, hits: 8, terminos: ['proyecto integrador', 'reto', 'evidencia'] }, { senal: 0, semanas: 0, hits: 0, terminos: [] }],
    estrategiaPedagogica: [{ senal: 83, semanas: 15, hits: 23, terminos: ['proyecto', 'proyecto integrador', 'reto'] }, { senal: 100, semanas: 18, hits: 31, terminos: ['ia'] }, { senal: 33, semanas: 6, hits: 7, terminos: ['empresa', 'cliente', 'real', 'negocio'] }, { senal: 17, semanas: 3, hits: 12, terminos: ['evidencia', 'seguimiento', 'recoleccion', 'recolección'] }],
  },
  frontend2: {
    consultorTech: [{ senal: 22, semanas: 4, hits: 8, terminos: ['requerimiento', 'negocio'] }, { senal: 89, semanas: 16, hits: 42, terminos: ['estructura', 'diseñar', 'diseño', 'arquitectura', 'construir'] }, { senal: 6, semanas: 1, hits: 1, terminos: ['presentación'] }, { senal: 17, semanas: 3, hits: 5, terminos: ['proyecto integrador', 'seguimiento'] }],
    marcoNacional: [{ senal: 50, semanas: 9, hits: 14, terminos: ['concepto', 'tipos', 'conocer'] }, { senal: 17, semanas: 3, hits: 3, terminos: ['construir'] }, { senal: 28, semanas: 5, hits: 5, terminos: ['pacto', 'colaborativo'] }],
    empleabilidad: [{ senal: 33, semanas: 6, hits: 8, terminos: ['datos', 'seguridad'] }, { senal: 28, semanas: 5, hits: 6, terminos: ['empresa', 'empresarial', 'rol'] }, { senal: 28, semanas: 5, hits: 10, terminos: ['proyecto integrador', 'reto', 'evidencia', 'funcional'] }, { senal: 28, semanas: 5, hits: 9, terminos: ['herramienta'] }],
    estrategiaPedagogica: [{ senal: 78, semanas: 14, hits: 18, terminos: ['proyecto', 'proyecto integrador', 'reto'] }, { senal: 100, semanas: 18, hits: 37, terminos: ['ia'] }, { senal: 22, semanas: 4, hits: 5, terminos: ['empresa', 'negocio'] }, { senal: 33, semanas: 6, hits: 18, terminos: ['evaluacion', 'evaluación', 'evidencia', 'seguimiento', 'recoleccion'] }],
  },
};

// Vocabulario controlado por factor (mismo orden que DIMENSIONES). Espejo del léxico de
// scripts/calcular-evidencia-alineacion.mjs; permite recomputar la señal en vivo en el cliente.
export const LEXICO_FACTORES = {
  consultorTech: [
    ['cliente', 'usuario', 'requerimiento', 'requisito', 'necesidad', 'problema', 'enunciado', 'contexto', 'negocio', 'interpretar', 'comprender', 'caso'],
    ['solucion', 'solución', 'diseñar', 'diseño', 'algoritmo', 'propuesta', 'modelo', 'arquitectura', 'estructura', 'plantear', 'construir'],
    ['comunicar', 'presentar', 'presentación', 'sustentar', 'exponer', 'explicar', 'socializar', 'informe', 'documentar'],
    ['implementar', 'implementación', 'acompañar', 'seguimiento', 'entregar', 'entrega', 'proyecto integrador', 'prueba', 'validar', 'ajustar'],
  ],
  marcoNacional: [
    ['concepto', 'fundamento', 'teoria', 'teoría', 'definir', 'identificar', 'conocer', 'principio', 'tipos', 'clasificacion', 'clasificación'],
    ['aplicar', 'desarrollar', 'construir', 'implementar', 'resolver', 'crear', 'realizar', 'elaborar', 'manejar', 'utilizar', 'practicar', 'ejercicio'],
    ['autonomia', 'autonomía', 'responsabilidad', 'etica', 'ética', 'trabajo en equipo', 'actitud', 'compromiso', 'pacto', 'colaborativo'],
  ],
  empleabilidad: [
    ['cloud', 'nube', 'inteligencia artificial', 'machine learning', 'devops', 'ciberseguridad', 'seguridad', 'full-stack', 'fullstack', 'api', 'datos', 'analitica', 'analítica', 'ci/cd', 'despliegue', 'deploy', 'contenedor', 'docker', 'react', 'node', 'python', 'sql'],
    ['empresa', 'empresarial', 'laboral', 'industria', 'rol', 'perfil', 'mercado', 'produccion', 'producción', 'profesional', 'sector'],
    ['proyecto integrador', 'reto', 'entregable', 'portafolio', 'evidencia', 'producto', 'funcional', 'sprint', 'demo'],
    ['actual', 'tendencia', 'moderno', 'vigente', 'nuevo', 'innovador', 'emergente', 'herramienta'],
  ],
  estrategiaPedagogica: [
    ['proyecto', 'proyecto integrador', 'abp', 'reto', 'problema', 'caso', 'producto'],
    ['ia', 'inteligencia artificial', 'copilot', 'chatgpt', 'prompt', 'generativa', 'asistida', 'vibe coding'],
    ['real', 'empresa', 'cliente', 'contexto', 'medellin', 'medellín', 'negocio', 'caso real', 'escenario'],
    ['evidencia', 'rubrica', 'rúbrica', 'evaluacion', 'evaluación', 'seguimiento', 'recoleccion', 'recolección', 'sustentar', 'portafolio'],
  ],
};

function normalizarTexto(t) {
  return ' ' + (t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9\s/-]/g, ' ') + ' ';
}

// Recalcula la evidencia léxica EN VIVO a partir del planeador actual (array de semanas del API).
// Devuelve la misma estructura que ALINEACION_EVIDENCIA[materia]; null si no hay datos.
export function calcularEvidenciaCorpus(planeador) {
  if (!Array.isArray(planeador) || planeador.length === 0) return null;
  const normSem = planeador.map(w =>
    normalizarTexto([w.tematicas, w.resultadoAprendizaje, w.metodologia, w.observaciones, w.unidadAprendizaje].filter(Boolean).join(' '))
  );
  const total = normSem.length;
  const out = {};
  for (const dim of DIMENSIONES) {
    const lex = LEXICO_FACTORES[dim.key] || [];
    out[dim.key] = dim.factores.map((f, i) => {
      const terms = lex[i] || [];
      let semanas = 0, hits = 0;
      const found = new Set();
      for (const n of normSem) {
        let hitWeek = false;
        for (const term of terms) {
          const nt = normalizarTexto(term).trim();
          if (!nt) continue;
          let idx = -1;
          while ((idx = n.indexOf(nt, idx + 1)) !== -1) { hits++; found.add(term); hitWeek = true; }
        }
        if (hitWeek) semanas++;
      }
      return { senal: Math.round((semanas / total) * 100), semanas, hits, terminos: [...found].slice(0, 5) };
    });
  }
  return out;
}

// Metodología analítica global: canalización (pipeline) reproducible con que se obtiene cada puntaje.
export const METODOLOGIA_ANALITICA = {
  resumen: 'Cada puntaje surge de un proceso reproducible: una inteligencia artificial evalúa el contenido real del planeador y su lectura se combina con el criterio experto y los referentes del sector. No son valores puestos a mano.',
  diagrama: [
    { titulo: 'Planeador', sub: 'texto de las 18 semanas' },
    { titulo: 'Evaluación con IA', sub: 'lectura del contenido (modo determinista)' },
    { titulo: 'Triangulación', sub: 'IA y criterio experto (α 0.5)' },
    { titulo: 'Radar', sub: 'puntaje ponderado por dimensión' },
  ],
  pasos: [
    { nombre: 'Corpus del planeador', detalle: 'Se reúne en un solo texto el contenido de las 18 semanas (temáticas, resultados de aprendizaje, metodología y observaciones). Ese texto es la base que se analiza.' },
    { nombre: 'Evaluación con inteligencia artificial', detalle: 'Una inteligencia artificial (un modelo de lenguaje configurado en modo determinista, es decir, sin azar, para que dé siempre el mismo resultado) lee ese contenido y le asigna a cada competencia un valor de 0 a 100, según qué tan presente está, incluso cuando se trabaja de forma implícita y no se menciona con esas palabras. El resultado se guarda en memoria según el contenido del planeador, así que es estable y solo se vuelve a calcular cuando el planeador cambia.', resaltado: 'Por ejemplo, si una semana propone resolver un problema de inventario para una tienda, la inteligencia artificial reconoce que ahí se ejercita "interpretar al cliente", aunque el texto no use la palabra cliente.' },
    { nombre: 'Verificación léxica', detalle: 'En paralelo, el sistema cuenta en cuántas de las 18 semanas aparece el vocabulario propio de cada competencia (un listado de palabras clave por factor). Esta señal sirve solo para comprobar que la lectura de la inteligencia artificial es coherente con lo que el texto dice de forma literal; no modifica el puntaje.', resaltado: 'Por ejemplo, para la competencia de empleabilidad se buscan palabras como "datos", "SQL" o "nube": si aparecen en muchas semanas, confirman que esos temas realmente se trabajan.' },
    { nombre: 'Triangulación', detalle: 'El valor final de cada competencia mezcla, a partes iguales, la evaluación de la inteligencia artificial y el criterio experto. Esa proporción se llama alfa (α).', resaltado: 'Un alfa de 0.5 significa que cada fuente aporta la mitad: 50 % la inteligencia artificial y 50 % el criterio experto. Si fuera más alto, por ejemplo 0.7, la inteligencia artificial pesaría más.', detalleCont: 'Los factores que no se pueden leer del planeador (como la valoración del testeo con 8 empresas o la demanda del estudio Cenisoft 2025, además del Marco Nacional de Cualificaciones y el CUOC) se mantienen con el criterio experto.' },
    { nombre: 'Puntaje por dimensión', detalle: 'Cada competencia, ya en escala de 0 a 100, se combina dentro de su dimensión mediante una suma ponderada: el puntaje es la suma de cada valor multiplicado por su peso, dividida entre 100. Los pesos de una misma dimensión suman 100.' },
  ],
  nota: 'La inteligencia artificial lee el contenido real y por eso a veces es más exigente que la intuición: una competencia transversal, como interpretar o comunicar, puede estar poco desarrollada aunque el nombre suene relacionado. El criterio experto y los referentes del sector equilibran esa lectura, y la verificación léxica solo comprueba coherencia, no asigna puntaje.',
};

export const DIDACTICAS = {
  logica: [
    { metodo: 'Consultoría simulada: traducir problemas en algoritmos', aplicacion: 'El estudiante recibe un caso de negocio desordenado (inventario, nómina, logística) y debe identificar qué problema resolver, descomponerlo en pasos lógicos y presentar la solución algorítmica al «cliente» (otro equipo).', beneficio: 'Forma al Intérprete: comprensión del negocio' },
    { metodo: 'Retos de lógica con contexto empresarial', aplicacion: 'Problemas con dificultad progresiva basados en escenarios reales de Medellín: calcular costos de un domicilio, optimizar turnos de un call center, gestionar un inventario de tienda.', beneficio: 'Conexión lógica-realidad organizacional' },
    { metodo: 'Programación en parejas con roles consultor-cliente', aplicacion: 'Un estudiante describe el problema en lenguaje natural (cliente) y el otro lo traduce a pseudocódigo (consultor). Rotar roles cada 15 minutos para desarrollar ambas perspectivas.', beneficio: 'Comunicación técnica y escucha activa' },
    { metodo: 'Pruebas de escritorio como validación ante el cliente', aplicacion: 'Antes de entregar cualquier algoritmo, el estudiante ejecuta pruebas de escritorio y presenta los resultados al grupo como si fuera una validación ante un cliente: datos de entrada, proceso y resultado esperado.', beneficio: 'Criterio de calidad desde el inicio' },
  ],
  intro: [
    { metodo: 'Prototipado rápido para validar ideas', aplicacion: 'El estudiante recibe un brief de un emprendimiento real y debe entregar en 2 horas una landing page funcional con HTML y CSS. El «cliente» (otro equipo) evalúa si entiende el propósito del negocio.', beneficio: 'Forma al Intérprete: traducir necesidades en prototipos' },
    { metodo: 'UX/UI con empatía: entrevista antes de maquetar', aplicacion: 'Antes de escribir CSS, el equipo entrevista al usuario final (o lo simula). Identificar necesidades, dolor y contexto antes de diseñar. Maquetar después.', beneficio: 'Comprensión del usuario, no solo del diseño' },
    { metodo: 'Git como herramienta de trabajo en equipo', aplicacion: 'Cada proyecto se gestiona con Git desde el día uno: ramas por feature, commits descriptivos, merges colaborativos. El docente revisa el historial como parte de la evaluación.', beneficio: 'Flujo de trabajo profesional desde el inicio' },
    { metodo: 'Retos de responsive con restricción de tiempo', aplicacion: 'Dado un diseño, el estudiante lo replica en 45 minutos para escritorio y móvil. Evaluar adaptabilidad, semántica HTML y CSS limpio.', beneficio: 'Velocidad y precisión bajo presión' },
  ],
  bd: [
    { metodo: 'Diagnóstico de datos para un negocio real', aplicacion: 'Cada equipo «asesora» un negocio local de Medellín: entrevista al dueño (simulada), identifica qué datos importan, diseña el modelo E-R y presenta la propuesta como si fuera una consultoría.', beneficio: 'Forma al Intérprete: interpretar necesidades de información' },
    { metodo: 'De la pregunta del negocio a la consulta SQL', aplicacion: 'El docente plantea preguntas de negocio (¿cuál es el producto más vendido? ¿Cuántos clientes repiten?) y el estudiante las traduce a consultas SQL. El valor está en la traducción, no solo en la sintaxis.', beneficio: 'Traducción negocio-datos' },
    { metodo: 'Analítica con Power BI sobre datos propios', aplicacion: 'Los estudiantes generan datos con sus propias consultas SQL, los exportan y construyen un dashboard en Power BI. Presentan las conclusiones al grupo como si fueran ante un comité directivo.', beneficio: 'Datos para la toma de decisiones' },
    { metodo: 'Normalización como consultoría de calidad', aplicacion: 'Entregar una base de datos desnormalizada y pedir al estudiante que identifique los problemas, proponga la normalización y argumente por qué mejora la integridad del negocio.', beneficio: 'Criterio técnico con impacto organizacional' },
  ],
  agiles: [
    { metodo: 'Levantamiento de requisitos con cliente real', aplicacion: 'El proyecto integrador arranca con una entrevista a un stakeholder (docente, coordinador o empresa aliada). El estudiante aplica técnicas de elicitación, documenta requisitos y los prioriza con el «cliente».', beneficio: 'Forma al Arquitecto: puente negocio-tecnología' },
    { metodo: 'Roles rotativos: PO, Scrum Master, desarrollador', aplicacion: 'Cada sprint del integrador, los estudiantes rotan entre Product Owner, Scrum Master y equipo técnico. Todos experimentan la perspectiva del cliente y del líder.', beneficio: 'Empatía organizacional y liderazgo' },
    { metodo: 'Casos de uso con actores reales', aplicacion: 'Especificar casos de uso no desde la teoría sino desde procesos observables: ¿qué hace una recepcionista al registrar un paciente? ¿Cómo pide un mesero una orden? El diagrama nace de la realidad.', beneficio: 'Modelado de dominio aterrizado' },
    { metodo: 'Retrospectivas con foco en habilidades blandas', aplicacion: 'Al final de cada sprint, evaluar no solo el producto sino la comunicación, la frustración gestionada, los conflictos resueltos y la autonomía demostrada. Usar formatos creativos (estrella de mar, barco velero).', beneficio: 'Competencias actitudinales que el mercado exige' },
  ],
  backend1: [
    { metodo: 'Del requisito del cliente al objeto Java', aplicacion: 'El estudiante recibe un requerimiento en lenguaje natural («necesito controlar el inventario de mi tienda») y debe diseñar las clases, atributos y métodos que lo resuelven. Defender el diseño ante el grupo como si fuera ante el cliente.', beneficio: 'Forma al Arquitecto: traducir requisitos en diseño' },
    { metodo: 'CRUD con caso empresarial progresivo', aplicacion: 'Un solo caso de negocio (ej: sistema de citas médicas) se desarrolla a lo largo del semestre: primero clases simples, luego herencia, luego persistencia con JPA. Cada entrega es un avance del mismo producto.', beneficio: 'Evolución de solución, no ejercicios aislados' },
    { metodo: 'Code review como práctica consultiva', aplicacion: 'Antes de cada entrega, otro equipo revisa el código con un checklist: ¿las clases tienen responsabilidad única? ¿El encapsulamiento es correcto? ¿La solución responde al problema del cliente?', beneficio: 'Cultura de calidad y criterio técnico' },
    { metodo: 'Git profesional: ramas, PR y convenciones', aplicacion: 'Todo el código se versiona con Git: una rama por feature, pull requests con descripción, nombres de commit siguiendo convenciones. El historial es parte de la evaluación.', beneficio: 'Flujo de trabajo de la industria desde el aula' },
  ],
  frontend1: [
    { metodo: 'Prototipar antes de codificar: wireframe consultor', aplicacion: 'Antes de cada proyecto, el estudiante boceta en papel la interfaz, presenta la propuesta al «cliente» (otro equipo), recoge retroalimentación y solo entonces codifica. El valor está en resolver el problema del usuario, no en el código.', beneficio: 'Forma al Arquitecto: diseño centrado en el usuario' },
    { metodo: 'Consumo de API como integración de servicios', aplicacion: 'Conectar el frontend a una API real (clima, noticias, datos públicos de Medellín) y presentar los datos de forma útil para un usuario no técnico. Evaluar la claridad de la presentación, no solo la conexión.', beneficio: 'Integración de sistemas con propósito' },
    { metodo: 'Depuración como resolución de problemas', aplicacion: 'Entregar código JavaScript con errores intencionales en el manejo del DOM, promesas o fetch. El estudiante debe diagnosticar, explicar la causa y corregir, como lo haría un consultor ante un sistema con fallos.', beneficio: 'Pensamiento crítico y resolución de problemas' },
    { metodo: 'Demo en vivo: presentar al cliente', aplicacion: 'Cada entrega incluye una presentación en vivo donde el estudiante demuestra la funcionalidad al grupo. Debe explicar qué problema resuelve, cómo lo resuelve y qué decisiones técnicas tomó.', beneficio: 'Comunicación técnica para audiencias no técnicas' },
  ],
  nuevastec: [
    { metodo: 'IA con criterio: evaluar antes de confiar', aplicacion: 'El estudiante usa IA generativa para resolver un problema técnico, pero debe evaluar críticamente la respuesta: ¿es correcta? ¿es segura? ¿es eficiente? Presentar un informe de validación, no solo la solución.', beneficio: 'Forma al Socio: uso estratégico de IA' },
    { metodo: 'Análisis de datos como asesoría', aplicacion: 'Cada equipo recibe un dataset real (ventas, encuestas, indicadores) y debe generar un reporte ejecutivo con Pandas y Matplotlib: problema, hallazgos, recomendaciones. Presentarlo como consultoría de datos.', beneficio: 'Datos para decisiones, no solo para gráficas' },
    { metodo: 'Hackathón de automatización', aplicacion: 'Jornada de 4 horas donde los equipos identifican un proceso repetitivo (en el aula, en una empresa simulada) y lo automatizan con Python. Evaluar impacto y viabilidad, no solo funcionalidad.', beneficio: 'Optimización de procesos con tecnología' },
    { metodo: 'Debate ético sobre IA en el trabajo', aplicacion: 'Panel grupal donde cada equipo defiende una postura sobre el uso de IA: ¿cuándo confiar? ¿qué riesgos hay? ¿cómo valida el consultor lo que produce una IA? Contraargumentos obligatorios.', beneficio: 'Criterio ético y pensamiento estratégico' },
  ],
  backend2: [
    { metodo: 'Arquitectura de solución antes de codificar', aplicacion: 'Antes de escribir la primera línea de Spring Boot, el equipo presenta un diagrama de arquitectura: capas, responsabilidades, flujo de datos. El docente evalúa el diseño como lo haría un arquitecto senior.', beneficio: 'Forma al Socio: pensar en sistemas, no en código' },
    { metodo: 'API documentada como producto de consultoría', aplicacion: 'Cada API se entrega con documentación Swagger completa y un README con instrucciones de uso. El «cliente» (otro equipo) debe poder usar la API sin ayuda del desarrollador.', beneficio: 'Documentación profesional y autonomía del cliente' },
    { metodo: 'TDD como garantía de calidad', aplicacion: 'Escribir primero la prueba con JUnit, luego el código que la pasa. Cada endpoint se entrega con su suite de pruebas. El porcentaje de cobertura es parte de la evaluación.', beneficio: 'Calidad como cultura, no como opción' },
    { metodo: 'Revisión cruzada de seguridad', aplicacion: 'Otro equipo revisa la API buscando vulnerabilidades: ¿hay validación de inputs? ¿Los endpoints sensibles están protegidos? ¿Los errores exponen datos internos? Informe de hallazgos por escrito.', beneficio: 'Seguridad como responsabilidad consultiva' },
  ],
  frontend2: [
    { metodo: 'Entrega completa: del boceto al deploy', aplicacion: 'El proyecto final se entrega publicado en un servidor real con dominio configurado: diseño, desarrollo, pruebas y despliegue. El estudiante presenta el producto al grupo como si fuera una entrega a un cliente.', beneficio: 'Forma al Socio: entrega integral de principio a fin' },
    { metodo: 'Test de usabilidad con usuarios reales', aplicacion: 'Antes de la entrega final, hacer pruebas de usabilidad con personas que no participaron en el desarrollo. Documentar hallazgos y aplicar mejoras. Presentar el antes y el después.', beneficio: 'UX basada en evidencia, no en suposiciones' },
    { metodo: 'Checklist de seguridad y rendimiento', aplicacion: 'Antes del deploy, el equipo recorre un checklist: HTTPS, validación de inputs, headers de seguridad, compresión de assets, pruebas de carga básicas. Informe de conformidad.', beneficio: 'Calidad profesional del producto final' },
    { metodo: 'Presentación ejecutiva del proyecto', aplicacion: 'Presentación de 10 minutos ante un panel (docentes + invitado externo si es posible): qué problema resuelve, a quién, decisiones técnicas, demo en vivo, lecciones aprendidas.', beneficio: 'Comunicación consultiva y cierre profesional' },
  ],
};

export const TESTEO_EMPRESARIAL = {
  meta: {
    titulo: 'Testeo con empresas del sector TI',
    metodologia: '8 entrevistas cualitativas semiestructuradas: 3 empresas de software, 1 empresa 360 y 4 empresas de capital humano del sector TI.',
    fuente: 'CESDE–Comfama, 2026',
    fuenteDetalle: 'Estudio de testeo empresarial realizado por CESDE en alianza con Comfama, mediante 8 entrevistas cualitativas a empresas del sector TI de Antioquia durante 2026.',
    hallazgoClave: 'El diferencial del junior ya no es cuánto sabe programar, sino qué tan rápido entiende, aprende y resuelve.',
  },
  brechas: [
    { nombre: 'Comprensión del negocio', nivel: 'critica' },
    { nombre: 'Pensamiento orientado a solución', nivel: 'alta' },
    { nombre: 'Habilidades blandas', nivel: 'alta' },
    { nombre: 'Uso estratégico de IA', nivel: 'alta' },
    { nombre: 'Automatización e integración', nivel: 'media' },
    { nombre: 'Autonomía y aprendizaje continuo', nivel: 'alta' },
  ],
  porMateria: {
    logica: {
      valoracion: 'alta',
      votos: { valorado: 5, menorImpacto: 0, diferenciador: 0 },
      razon: 'El mercado no prioriza tecnologías específicas, sino la capacidad de entender cómo funcionan los sistemas y adaptarse a cualquier lenguaje.',
      cita: '«Si se entiende la lógica se van a entender muchas cosas»',
      demandas: ['Pensamiento lógico-matemático', 'Resolución de problemas', 'Adaptabilidad a cualquier lenguaje'],
    },
    intro: {
      valoracion: 'media',
      votos: { valorado: 1, menorImpacto: 0, diferenciador: 0 },
      razon: 'Se reconoce valor en maquetación y UX como primera fluidez web del consultor, pero no se considera prioritario frente a lógica y datos.',
      cita: null,
      demandas: ['Maquetación responsive', 'UX/UI básico', 'Control de versiones (Git)', 'Prototipado rápido'],
    },
    bd: {
      valoracion: 'alta',
      votos: { valorado: 4, menorImpacto: 0, diferenciador: 1 },
      razon: 'El manejo de datos y modelos de datos es fundamental para el desarrollo actual, manejo de información y analítica. Diferenciador por conectar desarrollo con toma de decisiones.',
      cita: null,
      demandas: ['Modelado de datos', 'SQL avanzado', 'BD no relacionales', 'Analítica y Power BI', 'Gobierno de datos'],
    },
    agiles: {
      valoracion: 'media',
      votos: { valorado: 2, menorImpacto: 1, diferenciador: 0 },
      razon: 'Se valoran como marco de trabajo para dinámicas de equipo, pero se sugiere abordarlas a nivel de fundamentos. Su aplicación varía según la organización.',
      cita: '«Las metodologías ágiles son un framework útil, pero si no hay buen Scrum Master o PM, los proyectos se alargan»',
      demandas: ['Levantamiento de requisitos', 'Comunicación con clientes', 'Comprensión del negocio', 'Trabajo en equipo'],
    },
    backend1: {
      valoracion: 'media',
      votos: { valorado: 1, menorImpacto: 0, diferenciador: 0 },
      razon: 'No se cuestiona la relevancia de backend, pero sí su nivel de profundidad. Se sugiere simplificar y priorizar integración sobre desarrollo desde cero.',
      cita: null,
      demandas: ['POO sólida', 'Integración con BD', 'Criterio técnico', 'Versionamiento profesional'],
    },
    frontend1: {
      valoracion: 'media',
      votos: { valorado: 1, menorImpacto: 0, diferenciador: 0 },
      razon: 'Se reconoce valor en frontend para construir interfaces funcionales y consumir APIs.',
      cita: null,
      demandas: ['JavaScript sólido', 'Consumo de APIs', 'Interfaces funcionales', 'Adaptabilidad a frameworks'],
    },
    nuevastec: {
      valoracion: 'baja',
      votos: { valorado: 1, menorImpacto: 3, diferenciador: 0 },
      razon: 'Valoradas en actualización, pero no prioritarias por su carácter cambiante. El conocimiento puede adquirirse autónomamente. Se sugiere especializar en datos.',
      cita: '«Orientar el perfil hacia una especialización clara, como datos, en lugar de formar generalistas»',
      demandas: ['IA aplicada y prompting', 'Análisis de datos', 'Python para automatización', 'Criterio para evaluar resultados de IA'],
    },
    backend2: {
      valoracion: 'media',
      votos: { valorado: 1, menorImpacto: 2, diferenciador: 0 },
      razon: 'El mercado prioriza que el junior opere, adapte e integre más que construya desde cero. Se valora la profundización, pero se sugiere simplificar.',
      cita: null,
      demandas: ['API REST', 'Integración de sistemas', 'Ciberseguridad básica', 'Pruebas unitarias', 'DevSecOps'],
    },
    frontend2: {
      valoracion: 'media',
      votos: { valorado: 0, menorImpacto: 1, diferenciador: 1 },
      razon: 'Se valora la capacidad de desplegar soluciones completas. El componente de arquitectura web y seguridad es diferenciador.',
      cita: null,
      demandas: ['Despliegue y DevOps básico', 'Seguridad web', 'Arquitectura web', 'Cloud computing'],
    },
  },
};

export const REFERENCIAS = [
  {
    nombre: 'Marco Nacional de Cualificaciones (MNC)',
    url: 'https://especiales.colombiaaprende.edu.co/mnc/index.html',
    descripcion: 'Portal oficial del MNC — Colombia Aprende, Ministerio de Educación Nacional.',
    normativa: 'Decreto 1649 de 2021',
  },
  {
    nombre: 'Estructura y niveles del MNC',
    url: 'https://especiales.colombiaaprende.edu.co/mnc/estructura.html',
    descripcion: 'Descriptores por nivel: saber, saber-hacer, autonomía y responsabilidad.',
    normativa: null,
  },
  {
    nombre: 'Catálogo Nacional de Cualificaciones',
    url: 'https://especiales.colombiaaprende.edu.co/mnc/catalogo.html',
    descripcion: 'Cualificaciones registradas por sector productivo y nivel.',
    normativa: null,
  },
  {
    nombre: 'Sistema Nacional de Cualificaciones (SNC)',
    url: 'https://www.mineducacion.gov.co/portal/salaprensa/Comunicados/409610',
    descripcion: 'Comunicado oficial del MEN sobre el SNC y su marco normativo.',
    normativa: 'Ley 1955 de 2019, Art. 194',
  },
  {
    nombre: 'Decreto 923 de 2024 — Formación para el trabajo',
    url: 'https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=245116',
    descripcion: 'Vincula los programas técnicos laborales con los niveles 1–4 del MNC.',
    normativa: 'Decreto 923 de 2024',
  },
  {
    nombre: 'MinTIC — Talento Tech Colombia',
    url: 'https://talentodigital.mintic.gov.co/',
    descripcion: 'Programa nacional de formación en habilidades digitales avanzadas.',
    normativa: null,
  },
  {
    nombre: 'Ruta N — Ecosistema de innovación Medellín',
    url: 'https://rutanmedellin.org/',
    descripcion: 'Centro de innovación y negocios de Medellín. Reportes de talento y demanda del sector.',
    normativa: null,
  },
  {
    nombre: 'Estudio de brecha de talento digital (MinTIC + Fedesoft)',
    url: 'https://www.mintic.gov.co/portal/715/w3-article-425772.html',
    descripcion: 'Colombia necesitará 85.000 talentos digitales adicionales al 2030.',
    normativa: null,
  },
  {
    nombre: 'DANE — Clasificación Única de Ocupaciones (CUOC 2025)',
    url: 'https://clasificaciones.dane.gov.co/cuoc/grupo_primario/98/ficha/',
    descripcion: 'Ficha oficial de la ocupación 25120 Desarrolladores de software: nivel de competencia 4, área TICO, conocimientos y destrezas requeridos.',
    normativa: 'CUOC 2025',
  },
  {
    nombre: 'Estudio de Empleabilidad y Talento Digital — Colombia 2025 (Cenisoft)',
    url: 'https://cenisoft.org/estudioempleabilidadti/',
    descripcion: 'Análisis de más de 310.000 vacantes y 541 encuestas: enfoques TI más demandados, brechas de talento y déficit de habilidades blandas e inglés.',
    normativa: null,
  },
];

export const CONTEXTO_SECTOR = {
  resumen: 'El sector TI de Medellín proyecta un déficit de entre 68.000 y 112.000 desarrolladores a nivel nacional. El Estudio de Empleabilidad y Talento Digital — Colombia 2025 (Cenisoft), tras analizar más de 310.000 vacantes y 541 encuestas, identifica como enfoques más demandados: Big Data y analítica (50 %), inteligencia artificial y machine learning (47 %), computación en la nube (43 %), IoT (42 %), ciberseguridad (41 %), desarrollo full-stack (38 %), DevOps y SRE (36 %) y diseño UX/UI (32 %). El estudio revela un consenso multisectorial sobre la necesidad de actualización curricular urgente y una brecha crítica en habilidades blandas: comunicación, trabajo en equipo e inglés. Ruta N ha impulsado más de 480 empresas tech en la ciudad y ofrece más de 18.000 oportunidades de formación tecnológica al año. Los perfiles híbridos que combinan competencia técnica con habilidades blandas son los más valorados por las empresas.',
  fuentes: 'Estudio de Empleabilidad y Talento Digital — Colombia 2025 (Cenisoft), MinTIC + Fedesoft (2025), Ruta N (2024–2025).',
};

export const CONTEXTO_CUOC = {
  resumen: 'La Clasificación Única de Ocupaciones para Colombia (CUOC 2025) del DANE define la ocupación 25120 Desarrolladores de software dentro del área TICO, con nivel de competencia 4. Describe a quienes investigan, analizan y evalúan requisitos de aplicaciones y sistemas, y diseñan, desarrollan, prueban, mantienen e implementan soluciones de software optimizando recursos y tiempo. Es el referente ocupacional oficial contra el cual se valida la pertinencia del perfil de egreso del programa.',
  conocimientos: [
    'Desarrollo y análisis de software y aplicaciones',
    'Diseño y administración de redes y bases de datos',
    'Ingeniería y tecnología',
    'Manejo de las TIC',
    'Matemáticas',
  ],
  destrezas: [
    'Programación',
    'Resolución de problemas complejos',
    'Diseño de tecnología',
    'Creatividad',
    'Criterio y toma de decisiones',
  ],
  fuentes: 'DANE — Clasificación Única de Ocupaciones para Colombia (CUOC 2025), ocupación 25120.',
};

export const CONTEXTO_MNC = {
  resumen: 'El Marco Nacional de Cualificaciones (Decreto 1649 de 2021) estructura las cualificaciones en 8 niveles. Los programas técnicos laborales corresponden a los niveles 1–4 (Decreto 923 de 2024). Cada nivel se describe mediante tres dimensiones: Conocimientos (saber), Destrezas (saber-hacer, cognitivas y prácticas) y Actitudes (saber-ser, autonomía y responsabilidad). El programa Técnico Laboral en Desarrollo de Software de CESDE se ubica en el rango de los niveles 2–3 del MNC.',
  descriptores: [
    'Saber: hechos, principios, teorías y prácticas del campo de estudio.',
    'Saber-hacer: capacidad de aplicar conocimientos para resolver problemas (destrezas cognitivas y prácticas).',
    'Saber-ser: autonomía, responsabilidad y disposición para actuar en diferentes contextos.',
  ],
  fuentes: 'Ministerio de Educación Nacional, Colombia Aprende, Decreto 1649/2021, Decreto 923/2024.',
};

export const INFORME_PERTINENCIA = {
  meta: {
    titulo: 'Informe de pertinencia y ajuste curricular',
    metodologia: 'Análisis de 10 fichas de expertos (Sura, Globant, Comfama, Cyclops, entre otros) con categorización semáforo, 2 radares empresariales de cocreación y 1 sesión de audio con justificaciones técnicas.',
    fuente: 'CESDE — Panel de expertos sectoriales',
    diagnostico: 'El rol del asistente de software evoluciona de «codificador manual» a «habilitador tecnológico» que usa IA para acelerar la producción y comprende el contexto del negocio.',
  },
  ejesBrechas: [
    {
      eje: 'Tecnológico',
      actual: 'Java, SQL, Spring Boot, JavaScript y React',
      demanda: 'IA aplicada, nube (Azure/AWS), DevOps y CI/CD, analítica de datos',
      accion: 'Integrar la inteligencia artificial aplicada al desarrollo, los fundamentos de nube y el despliegue continuo, conservando el stack Java, JavaScript y React vigente',
      descripcion: 'El eje tecnológico concentra el dominio de lenguajes, frameworks y plataformas de desarrollo. El stack actual —Java, SQL, Spring Boot, JavaScript y React— conserva plena vigencia según el panel de expertos sectoriales; la evolución no implica sustituirlo, sino incorporar de manera transversal la inteligencia artificial aplicada al desarrollo (47 % de demanda), la computación en la nube (43 %) y las prácticas de DevOps e integración continua (36 %), señaladas por el Estudio de Empleabilidad y Talento Digital — Colombia 2025 (Cenisoft) como los enfoques de mayor proyección.',
      formacion: [
        'GitHub Copilot y prompting avanzado — IA aplicada al desarrollo',
        'Microsoft Azure Fundamentals (AZ-900) — certificación de nube',
        'AWS Certified Cloud Practitioner (CLF-C02) — certificación de nube',
        'CI/CD con GitHub Actions y contenedores Docker — despliegue continuo',
        'React con consumo de APIs REST — se conserva y se profundiza',
        'Analítica de datos con Power BI — Big Data, el enfoque más demandado (50 %)',
      ],
    },
    {
      eje: 'Funcional',
      actual: 'Configuración de hardware y ensamble de equipos',
      demanda: 'Traducción de requisitos a lógica de negocio, diseño de interfaces y flujo de ramas GitFlow',
      accion: 'Retirar los módulos de hardware e incorporar el levantamiento de requisitos y el diseño funcional de la solución',
      descripcion: 'El eje funcional describe qué construye el egresado y para quién: la capacidad de traducir una necesidad del cliente en una solución de software. Los expertos recomiendan retirar los contenidos de configuración de hardware —ajenos al perfil de desarrollo— y fortalecer el levantamiento de requisitos de negocio y el diseño de interfaces, competencias centrales del rol de «habilitador tecnológico» y del pilar del Consultor Tech de interpretar al cliente y diseñar soluciones. El diseño UX/UI concentra un 32 % de la demanda del sector (Cenisoft 2025).',
      formacion: [
        'Levantamiento y análisis de requisitos con historias de usuario',
        'Diseño UX/UI aplicado — 32 % de demanda del sector (Cenisoft 2025)',
        'Modelado de procesos de negocio (BPMN básico)',
        'Prototipado con IA generativa (v0, Figma) para validar con el cliente',
        'GitFlow — control de versiones como herramienta de trabajo empresarial',
      ],
    },
    {
      eje: 'Metodológico',
      actual: 'Scrum teórico y trabajo por asignaturas aisladas',
      demanda: 'ABP y proyecto integrador con agilismo real (Jira/Trello)',
      accion: 'Consolidar el Aprendizaje Basado en Proyectos y el proyecto integrador como columna metodológica, migrando del Scrum teórico a un agilismo real con herramientas de industria',
      descripcion: 'El eje metodológico define cómo se aprende y cómo se trabaja. La estrategia pedagógica del programa se sostiene en el Aprendizaje Basado en Proyectos (ABP) y en el proyecto integrador, que articula en un solo producto todas las materias de cada nivel y simula el ciclo real de entrega de software: interpretar al cliente, planear, construir, probar y sustentar. Ese entorno auténtico es el medio para ejercitar las metodologías ágiles que exige el sector —migrando del Scrum teórico a un agilismo real gestionado con Jira o Trello—. Así, el ABP y el proyecto integrador no son un complemento, sino la columna vertebral que conecta el saber, el saber-hacer y el saber-ser en una experiencia cercana a la de una célula de desarrollo profesional (DevOps y SRE, 36 % de demanda, Cenisoft 2025).',
      formacion: [
        'Aprendizaje Basado en Proyectos (ABP) — eje de la estrategia pedagógica',
        'Proyecto integrador por nivel — simulación del ciclo real de entrega',
        'Professional Scrum Master I (PSM I) — Scrum.org',
        'Gestión ágil con Jira y Trello — simulación de sprints reales',
        'Fundamentos de DevOps y cultura de entrega continua',
      ],
    },
    {
      eje: 'Humano',
      actual: 'Ética general',
      demanda: 'Comunicación asertiva, adaptabilidad e inglés técnico',
      accion: 'Talleres de comunicación técnica, manejo de la frustración e inglés para lectura de documentación oficial',
      descripcion: 'El eje humano reúne las competencias transversales (saber-ser) que el sector califica como diferenciadoras. El estudio Cenisoft 2025 identifica una brecha crítica en comunicación, trabajo en equipo e inglés; los perfiles híbridos que combinan solidez técnica con habilidades blandas son los más valorados por las empresas, y el inglés técnico resulta indispensable para la lectura de documentación oficial y la configuración de plataformas.',
      formacion: [
        'Comunicación técnica y presentación ejecutiva de soluciones',
        'Inglés técnico nivel B1 — lectura de documentación oficial',
        'Trabajo en equipo y manejo de la frustración',
        'Pensamiento crítico para validar los resultados de la IA',
      ],
    },
  ],
  porMateria: {
    logica: {
      semaforo: 'verde',
      consenso: '>60 %',
      diagnostico: 'Pilar fundamental del programa. Los expertos enfatizan que la sintaxis es delegable a la IA, pero la lógica de resolución de problemas no. Se recomienda priorizar la arquitectura y la limpieza del código sobre la memorización de comandos.',
      recomendaciones: ['Priorizar Clean Code y lógica sobre sintaxis', 'Enseñar a auditar la calidad del código que genera la IA', 'Mantener pruebas de escritorio como herramienta de validación'],
      cita: '«La IA facilitará la sintaxis, pero el estudiante debe saber auditar la calidad del resultado»',
    },
    intro: {
      semaforo: 'debate',
      consenso: 'Dividido',
      diagnostico: 'Zona de debate: algunos expertos sugieren reducir la profundidad de HTML/CSS dado que las IAs generativas y frameworks modernos ya manejan gran parte de la estructura básica. Se discute si debe ser un módulo completo o un conocimiento transversal.',
      recomendaciones: ['Evaluar si HTML/CSS debe ser módulo completo o transversal', 'Enfocar en UX/UI como diferenciador, no en maquetación básica', 'Integrar IA generativa para prototipado rápido'],
      cita: null,
    },
    bd: {
      semaforo: 'amarillo',
      consenso: '~50 %',
      diagnostico: 'La analítica de datos básica se considera importante, pero muchas empresas prefieren profundizar según el área de especialidad del proyecto. La integración de datos se ve como habilidad que se pule con la arquitectura específica de cada empresa.',
      recomendaciones: ['Mantener fundamentos de modelado y SQL como base sólida', 'Agregar analítica de datos aplicada a decisiones de negocio', 'Incorporar integración de datos como competencia transversal'],
      cita: null,
    },
    agiles: {
      semaforo: 'amarillo',
      consenso: '~50 %',
      diagnostico: 'El Scrum básico actual requiere migrar a un agilismo real con herramientas de industria. Las empresas suelen reentrenar al egresado en sus metodologías específicas de documentación. Se recomienda simular el entorno corporativo con Jira o Trello.',
      recomendaciones: ['Migrar de Scrum teórico a agilismo con Jira/Trello', 'Usar GitFlow como estándar de flujo empresarial', 'Simular sprints reales en los proyectos integradores', 'Agregar formación en traducción de requisitos de negocio'],
      cita: null,
    },
    backend1: {
      semaforo: 'verde',
      consenso: '>60 %',
      diagnostico: 'La POO es indispensable para la arquitectura de software moderna. Java mantiene total vigencia. Se recomienda integrar IA transversalmente: el estudiante debe aprender a realizar «programación en pares» con copilotos de IA.',
      recomendaciones: ['Integrar copilotos de IA (GitHub Copilot) en las prácticas de Java', 'Priorizar arquitectura y Clean Code sobre memorización', 'Enseñar al estudiante a auditar código generado por IA'],
      cita: null,
    },
    frontend1: {
      semaforo: 'verde',
      consenso: '>60 %',
      diagnostico: 'El desarrollo de aplicaciones web es función núcleo del programa con total vigencia. JavaScript sigue siendo fundamental para la interactividad y el consumo de APIs. Se recomienda incluir lectura de documentación en inglés.',
      recomendaciones: ['Mantener JavaScript como eje de interactividad web', 'Incluir lectura de documentación oficial en inglés', 'Integrar prácticas de consumo de APIs con contexto de negocio'],
      cita: null,
    },
    nuevastec: {
      semaforo: 'verde',
      consenso: 'Unánime',
      diagnostico: 'Marcado unánimemente como verde. El sector ya no ve la IA como opcional, sino como herramienta diaria de trabajo. Se recomienda no tratar la IA como materia aparte sino integrarla transversalmente y enseñar prompting avanzado para acelerar código.',
      recomendaciones: ['Integrar IA transversalmente, no como materia aislada', 'Enseñar prompting avanzado para acelerar desarrollo', 'Formar en «Vibe Coding» (programación asistida por IA)', 'Enfatizar pensamiento crítico para validar resultados de IA'],
      cita: '«El sector ya no ve la IA como opcional, sino como una herramienta diaria de trabajo»',
    },
    backend2: {
      semaforo: 'verde',
      consenso: '>60 %',
      diagnostico: 'Spring mantiene vigencia pero el eje debe evolucionar: se requiere integrar fundamentos de nube (Azure AZ-900, AWS Cloud Practitioner) y despliegues continuos (CI/CD). El egresado debe poder insertarse en células ágiles de alto rendimiento.',
      recomendaciones: ['Agregar fundamentos de Cloud (Azure/AWS)', 'Integrar CI/CD como parte del flujo de desarrollo', 'Incluir Infraestructura como Código como concepto introductorio', 'Mantener Spring Boot como framework principal'],
      cita: null,
    },
    frontend2: {
      semaforo: 'verde',
      consenso: '>60 %',
      diagnostico: 'El desarrollo web es función núcleo. Se recomienda evolucionar hacia despliegues continuos y fundamentos de nube. El componente de arquitectura web, seguridad y despliegue prepara al egresado como habilitador tecnológico completo.',
      recomendaciones: ['Integrar CI/CD en el flujo de despliegue', 'Incluir fundamentos de Cloud para hosting y escalabilidad', 'Mantener foco en seguridad web y pruebas de carga', 'Enseñar inglés técnico para configuración de plataformas'],
      cita: null,
    },
  },
};

export const RECOMENDACIONES_PLANEADOR = {
  // Cada recomendación es un ajuste concreto al planeador con tres campos: un título que resume el
  // contenido, la justificación de por qué se incorpora y el temario tal como quedaría en la casilla
  // de temáticas de esa semana. Bloques: auditoría de software con IA (progresiva en S5, S11 y S15),
  // Git/GitFlow transversal (escala por nivel; BD no lo lleva), Clean Code al inicio (Lógica, Backend I
  // y II), DevOps como teoría al inicio de Ágiles y fundamentos de nube en las últimas sesiones
  // (BD, Backend I y II).
  logica: [
    { semana: '2–3', titulo: 'Clean Code desde el pseudocódigo', justificacion: 'Instala buenos hábitos de escritura de código desde la fundamentación —cuando aún se aprende lógica secuencial— para evitar vicios difíciles de corregir después. Es el primer eslabón de la línea de Clean Code que continúa en Backend I y II.', temario: 'Principios de Clean Code aplicados al pseudocódigo: nombres significativos de variables y constantes; una sola responsabilidad por bloque; sangría y estructura legible; comentarios que explican el porqué y no el qué; lectura crítica de un algoritmo propio y de uno ajeno para valorar su claridad.' },
    { semana: '5', titulo: 'Auditar algoritmos con IA — identificar y explicar', justificacion: 'Primer nivel de auditoría con IA: usar la IA para leer y explicar la lógica secuencial y los operadores, desarrollando el criterio de entender el código antes de confiar en él.', temario: 'Uso de asistentes de IA para leer y explicar algoritmos de lógica secuencial (entrada, proceso, salida) y expresiones con operadores aritméticos y lógicos; pedir a la IA que describa paso a paso el flujo; contrastar su explicación con la prueba de escritorio.' },
    { semana: '11', titulo: 'Auditar calidad y errores con IA — condicionales y ciclos', justificacion: 'Segundo nivel: usar la IA para detectar errores de lógica y casos no cubiertos en condicionales múltiples, contadores y acumuladores. El estudiante audita, no solo genera.', temario: 'Auditoría con IA de algoritmos con condicionales simples, dobles y múltiples, contadores y acumuladores; identificación de casos borde y errores de lógica; validación de cálculos de porcentajes y promedios; el estudiante decide si acepta o corrige la sugerencia de la IA.' },
    { semana: '15', titulo: 'Auditar, corregir y documentar con IA — funciones y arreglos', justificacion: 'Tercer nivel: auditar código con funciones y arreglos, corregir con criterio y documentar el resultado, cerrando el ciclo de una auditoría responsable con IA.', temario: 'Auditoría integral con IA de algoritmos con funciones, métodos y arreglos unidimensionales; refactorización guiada (mejorar nombres, dividir funciones largas); documentación del algoritmo y de las correcciones aplicadas; reflexión sobre el uso ético y responsable de la IA.' },
    { semana: 'S3–18', continua: true, titulo: 'Git básico como práctica sugerida', justificacion: 'Inicia el control de versiones desde el primer nivel: cada evidencia y ejercicio se versiona. Es la base del trabajo colaborativo que escala a GitFlow en los niveles siguientes.', temario: 'Uso sugerido de Git a partir de la semana 3, en cada sesión (nivel introductorio): crear un repositorio, realizar commits con mensajes claros, clonar y subir cambios (push/pull); llevar el historial de los algoritmos y evidencias del módulo como práctica cotidiana.' },
  ],
  intro: [
    { semana: '5', titulo: 'Auditar HTML con IA — identificar y explicar', justificacion: 'Primer nivel de auditoría con IA sobre la estructura del sitio: usar la IA para leer y explicar el marcado HTML y sus formularios, entendiendo qué hace cada etiqueta.', temario: 'Uso de asistentes de IA para leer y explicar la estructura HTML5 (etiquetas semánticas, tablas, multimedia) y los formularios; pedir a la IA que describa la función de cada etiqueta y atributo; contrastar la explicación con la vista en el navegador.' },
    { semana: '11', titulo: 'Auditar calidad y errores con IA — maquetación CSS', justificacion: 'Segundo nivel: auditar con IA la maquetación con Flexbox y el posicionamiento, detectando problemas de responsividad y accesibilidad.', temario: 'Auditoría con IA de hojas de estilo CSS: propiedades de espaciado, posicionamiento y Flexbox; detección de problemas de diseño responsive y de accesibilidad (contraste, unidades relativas); el estudiante valida y corrige las sugerencias de la IA sobre su maqueta.' },
    { semana: '15', titulo: 'Auditar, corregir y documentar con IA — framework CSS', justificacion: 'Tercer nivel: auditar un proyecto de maquetación con framework CSS, corregir y documentar buenas prácticas, cerrando la auditoría responsable con IA.', temario: 'Auditoría integral con IA de una maquetación con framework CSS (Bootstrap o Tailwind): revisión del sistema de filas y columnas, componentes y utilidades; refactorización guiada por la IA y documentación de las mejoras; reflexión sobre el uso ético de la IA.' },
    { semana: 'S3–18', continua: true, titulo: 'Git básico y primeras ramas como práctica sugerida', justificacion: 'Refuerza el control de versiones del nivel I y da el primer paso hacia el trabajo con ramas, preparando el GitFlow del nivel II. El módulo ya introduce Git, aquí se sistematiza a partir de la semana 3, en cada sesión.', temario: 'Uso sugerido de Git a partir de la semana 3, en cada sesión: repositorio, commits, clonar, subir y bajar cambios; creación de ramas simples y unión de cambios (merge); reversión de cambios; versionar cada evidencia de maquetación del módulo.' },
  ],
  bd: [
    { semana: '5', titulo: 'Auditar SQL con IA — identificar y explicar', justificacion: 'Primer nivel de auditoría con IA sobre el lenguaje SQL: usar la IA para leer y explicar sentencias DDL y de creación de tablas, entendiendo su efecto antes de ejecutarlas.', temario: 'Uso de asistentes de IA para leer y explicar sentencias SQL de definición (DDL): creación de bases de datos y tablas, tipos de datos y restricciones; pedir a la IA que describa qué hace cada sentencia; contrastar con la ejecución en el gestor.' },
    { semana: '11', titulo: 'Auditar calidad y errores con IA — consultas y manipulación', justificacion: 'Segundo nivel: auditar con IA consultas con JOIN y sentencias de manipulación (UPDATE, DELETE, WHERE), detectando errores y riesgos sobre los datos.', temario: 'Auditoría con IA de consultas SQL con INNER/LEFT/RIGHT JOIN y de sentencias UPDATE y DELETE con cláusula WHERE; identificación de errores lógicos y de operaciones peligrosas (borrados o actualizaciones sin filtro); el estudiante valida y corrige la sugerencia de la IA.' },
    { semana: '15', titulo: 'Auditar, corregir y documentar con IA — NoSQL y analítica', justificacion: 'Tercer nivel: auditar con IA el modelo NoSQL y las consultas de analítica, corregir y documentar, cerrando la auditoría responsable con IA sobre los datos.', temario: 'Auditoría integral con IA de una base de datos no relacional (MongoDB) y de las consultas que alimentan un informe en Power BI; revisión de la estructura de documentos y de la calidad del dato; documentación de hallazgos y correcciones; reflexión sobre el uso ético de la IA.' },
    { semana: '15–16', titulo: 'Fundamentos de nube y bases de datos gestionadas', justificacion: 'Cierra el módulo conectando el modelado con la realidad de la industria: hoy las bases de datos viven en la nube. Es el primer eslabón de la línea de nube que continúa en Backend I y II.', temario: 'Introducción a la computación en la nube aplicada a datos: qué es una base de datos gestionada; panorama de Azure SQL Database y MongoDB Atlas; creación de una base de datos en la nube y conexión desde el cliente; nociones de respaldo, escalabilidad y seguridad del dato gestionado.' },
  ],
  agiles: [
    { semana: '2–3', titulo: 'DevOps y ciclo de vida del desarrollo (teoría)', justificacion: 'Presenta la cultura DevOps como marco teórico justo donde el módulo aborda las fases del desarrollo de software, dando sentido a la integración y entrega continuas antes de practicarlas. Es la base conceptual que los niveles siguientes aplican.', temario: 'Ciclo de vida del desarrollo de software (análisis, diseño, desarrollo, pruebas, despliegue, operación); qué es DevOps y su cultura de colaboración; conceptos de integración continua (CI) y entrega continua (CD); relación entre el agilismo y DevOps; el flujo desde el código hasta producción, a nivel conceptual.' },
    { semana: '5', titulo: 'Auditar artefactos ágiles con IA — identificar y explicar', justificacion: 'Primer nivel de auditoría con IA sobre los documentos del proceso: usar la IA para revisar y explicar los artefactos de agilismo y de gestión de la información.', temario: 'Uso de asistentes de IA para leer y explicar artefactos del proceso (visión de producto, mapas de historias, procedimientos documentales); pedir a la IA que resuma y clarifique un documento del proyecto; contrastar la explicación con la normativa y la guía técnica del módulo.' },
    { semana: '11', titulo: 'Auditar calidad con IA — historias de usuario y backlog', justificacion: 'Segundo nivel: auditar con IA la calidad de las historias de usuario y del backlog, detectando ambigüedades y criterios de aceptación faltantes.', temario: 'Auditoría con IA de historias de usuario y del product backlog: verificación de criterios de aceptación, claridad y estimabilidad (buenas prácticas INVEST); identificación de historias ambiguas o duplicadas; el estudiante decide si acepta o corrige la sugerencia de la IA.' },
    { semana: '15', titulo: 'Auditar, corregir y documentar con IA — métricas del proceso', justificacion: 'Tercer nivel: auditar con IA las métricas del equipo (burndown, velocity), interpretar y documentar conclusiones, cerrando la auditoría responsable con IA.', temario: 'Auditoría integral con IA de las métricas de comportamiento del equipo (burndown chart, velocity, flujo acumulado): interpretación de tendencias, detección de desviaciones y redacción asistida de conclusiones; documentación del análisis; reflexión sobre el uso ético de la IA.' },
    { semana: 'S3–18', continua: true, titulo: 'GitFlow como práctica sugerida del equipo', justificacion: 'Escala el control de versiones del nivel I al trabajo en equipo con GitFlow, conectándolo con las ceremonias de Scrum. Es el flujo profesional que se profundiza en el nivel III.', temario: 'Uso sugerido de GitFlow a partir de la semana 3, en cada sesión: ramas main, develop y feature; una rama por historia de usuario; unión de cambios mediante merge y pull request; resolución básica de conflictos; sincronización del flujo de ramas con el tablero y las ceremonias del sprint.' },
  ],
  backend1: [
    { semana: '2–3', titulo: 'Clean Code en Java desde el inicio', justificacion: 'Segundo eslabón de la línea de Clean Code (tras Lógica): al comenzar con estructuras y modularidad en Java, se fijan las buenas prácticas antes de entrar a la POO, elevando la calidad de todo el módulo.', temario: 'Clean Code aplicado a Java: nombres significativos de clases, métodos y variables; métodos cortos con una sola responsabilidad; evitar la duplicación (principio DRY); uso adecuado de colecciones (List, Map); formateo y legibilidad; lectura crítica del propio código para refactorizarlo.' },
    { semana: '5', titulo: 'Auditar código Java con IA — identificar y explicar', justificacion: 'Primer nivel de auditoría con IA sobre la POO: usar la IA para leer y explicar clases, atributos y métodos, entendiendo el modelo antes de extenderlo.', temario: 'Uso de asistentes de IA para leer y explicar código Java con clases, objetos, atributos, métodos y constructores; pedir a la IA que describa las responsabilidades de una clase; contrastar la explicación con la ejecución y el diseño previsto.' },
    { semana: '11', titulo: 'Auditar calidad y errores con IA — herencia e interfaces', justificacion: 'Segundo nivel: auditar con IA la jerarquía de clases (herencia, polimorfismo, clases abstractas, interfaces), detectando malos usos y acoplamientos.', temario: 'Auditoría con IA de código con herencia, polimorfismo, clases abstractas e interfaces; detección de jerarquías mal diseñadas, métodos mal sobrescritos y acoplamiento innecesario; verificación de buenas prácticas de POO; el estudiante valida y corrige la sugerencia de la IA.' },
    { semana: '15', titulo: 'Auditar, corregir y documentar con IA — persistencia JPA', justificacion: 'Tercer nivel: auditar con IA el CRUD con JPA/Hibernate, corregir y documentar, cerrando la auditoría responsable con IA sobre la capa de datos.', temario: 'Auditoría integral con IA del mapeo de entidades y las operaciones CRUD con JPA e Hibernate; revisión de relaciones entre entidades y de la calidad de las consultas; refactorización guiada y documentación de las correcciones; reflexión sobre el uso ético de la IA.' },
    { semana: '15–16', titulo: 'Desplegar en la nube: la aplicación fuera del equipo local', justificacion: 'Segundo eslabón de la línea de nube (tras BD): el estudiante lleva su aplicación Java a un entorno de nube, entendiendo qué significa que un servicio esté disponible en internet. Prepara el despliegue profesional de Backend II.', temario: 'Fundamentos de despliegue en la nube: diferencia entre entorno local y en la nube; panorama de proveedores (Microsoft Azure, AWS) y servicios de cómputo; publicación de una aplicación o base de datos en la nube; nociones de variables de entorno y de configuración segura de credenciales.' },
    { semana: 'S3–18', continua: true, titulo: 'GitFlow con ramas por funcionalidad (uso sugerido en cada sesión)', justificacion: 'Continúa la línea de Git escalando a GitFlow en un proyecto de código real, práctica que el módulo ya insinúa con el uso de Git/GitHub durante toda la POO.', temario: 'Uso sugerido de GitFlow a partir de la semana 3, en cada sesión: ramas main y develop; una rama feature por cada funcionalidad de la POO; commits atómicos; integración mediante pull request con revisión del compañero; resolución básica de conflictos; versionar cada avance del módulo.' },
  ],
  frontend1: [
    { semana: '5', titulo: 'Auditar JavaScript con IA — identificar y explicar', justificacion: 'Primer nivel de auditoría con IA sobre los fundamentos de JavaScript: usar la IA para leer y explicar variables, condicionales, ciclos y funciones.', temario: 'Uso de asistentes de IA para leer y explicar código JavaScript con tipos de datos, operadores, condicionales, ciclos y funciones (flecha, regulares, anónimas); pedir a la IA que describa el flujo del programa; contrastar la explicación con la consola del navegador.' },
    { semana: '11', titulo: 'Auditar calidad y errores con IA — estructuras y DOM', justificacion: 'Segundo nivel: auditar con IA el manejo de arreglos, objetos y la manipulación del DOM, detectando errores y malas prácticas.', temario: 'Auditoría con IA de código que usa arreglos, objetos, métodos de array (filter, map, push) y manipulación del DOM (selectores, traversing); detección de errores y de código poco eficiente; el estudiante valida y corrige la sugerencia de la IA sobre su script.' },
    { semana: '15', titulo: 'Auditar, corregir y documentar con IA — asincronía y APIs', justificacion: 'Tercer nivel: auditar con IA el código asíncrono y el consumo de API REST, corregir y documentar, cerrando la auditoría responsable con IA.', temario: 'Auditoría integral con IA de código asíncrono (callbacks, promesas, async/await) y del consumo de una API REST con fetch; revisión del manejo de errores y de los estados de carga; refactorización guiada y documentación de las mejoras; reflexión sobre el uso ético de la IA.' },
    { semana: 'S3–18', continua: true, titulo: 'GitFlow en el proyecto front (uso sugerido en cada sesión)', justificacion: 'Aplica GitFlow al desarrollo del frontend, consolidando el flujo de ramas del nivel II sobre un proyecto de código que evoluciona sesión a sesión.', temario: 'Uso sugerido de GitFlow a partir de la semana 3, en cada sesión: ramas main, develop y feature; una rama por funcionalidad del frontend; integración mediante pull request con revisión; resolución de conflictos en archivos JavaScript; versionar cada avance del proyecto del módulo.' },
  ],
  nuevastec: [
    { semana: '5', titulo: 'Auditar Python con IA — identificar y explicar', justificacion: 'Primer nivel de auditoría con IA sobre Python para datos: usar la IA para leer y explicar el código base y la estructura del proyecto de analítica.', temario: 'Uso de asistentes de IA para leer y explicar código Python (variables, listas, diccionarios, condicionales, ciclos y funciones utilitarias) y la estructura de un proyecto de analítica con entorno virtual; pedir a la IA que describa qué hace un script; contrastar con la ejecución.' },
    { semana: '11', titulo: 'Auditar calidad y errores con IA — transformación de datos', justificacion: 'Segundo nivel: auditar con IA el proceso de limpieza y transformación de datos con Pandas, detectando errores que comprometen el análisis.', temario: 'Auditoría con IA de código de depuración y transformación de datos con Pandas (read_csv, merge, groupby, agg, columnas derivadas); detección de errores de calidad del dato (IDs huérfanos, categorías inconsistentes) y de transformaciones incorrectas; el estudiante valida y corrige la sugerencia de la IA.' },
    { semana: '15', titulo: 'Auditar, corregir y documentar con IA — reportes y APIs', justificacion: 'Tercer nivel: auditar con IA la visualización, los reportes automatizados y el consumo de APIs, corregir y documentar, cerrando la auditoría responsable con IA.', temario: 'Auditoría integral con IA de la visualización con Matplotlib y Seaborn, de los reportes automatizados (HTML, PDF) y del consumo de APIs con Python; revisión de la claridad de los gráficos y de la reproducibilidad del reporte; documentación de las correcciones; reflexión sobre el uso ético de la IA.' },
    { semana: '13–14', titulo: 'Rutas de certificación y cursos gratuitos de IA y nube', justificacion: 'Al ser el módulo de nuevas tecnologías, es el punto ideal para que el estudiante sume credenciales verificables sin costo: la formación de estas rutas es gratuita y son muy valoradas por el sector para roles de IA, datos y nube. Solo el examen oficial de certificación tiene costo.', temario: 'Rutas gratuitas de formación. La formación es gratuita; solo el examen oficial de certificación tiene costo (se indica cuando aplica).\n\nInteligencia artificial:\n• Anthropic Academy — cursos sobre Claude, la API y prompt engineering, con certificado oficial tras un quiz final, sin tarjeta ni API key: https://anthropic.skilljar.com\n• Microsoft «Career Essentials in Generative AI» (con LinkedIn) — 5 módulos con certificado profesional: https://www.linkedin.com/learning/paths/career-essentials-in-generative-ai-by-microsoft-and-linkedin\n• Microsoft «Generative AI for Beginners» — 21 lecciones en GitHub: https://github.com/microsoft/generative-ai-for-beginners\n• Azure AI Fundamentals (AI-900 → AI-901) — formación gratis en Microsoft Learn; examen ~USD 99 (estudiantes desde USD 0 a 15 en algunas regiones). El AI-900 se retiró el 30 de junio de 2026: https://learn.microsoft.com/credentials/certifications/azure-ai-fundamentals/\n\nNube:\n• Microsoft Azure Fundamentals (AZ-900) — formación gratis en Microsoft Learn; examen ~USD 99, con vouchers gratuitos en los Microsoft Virtual Training Days: https://learn.microsoft.com/credentials/certifications/azure-fundamentals/\n• AWS Certified Cloud Practitioner (CLF-C02) — curso gratuito «AWS Cloud Practitioner Essentials» en AWS Skill Builder; examen ~USD 100: https://skillbuilder.aws\n\nNota: los precios se cobran en dólares (o su equivalente local más impuestos) y pueden variar; conviene verificar en el sitio oficial antes de inscribirse.' },
    { semana: 'S3–18', continua: true, titulo: 'GitFlow avanzado con revisión de código (uso sugerido en cada sesión)', justificacion: 'Consolida el flujo profesional del nivel III: además de las ramas, se practica la revisión de código en pull requests sobre el proyecto de analítica.', temario: 'Uso sugerido de GitFlow avanzado a partir de la semana 3, en cada sesión: ramas feature por análisis; pull requests con revisión de código entre pares (comentarios y aprobación); resolución de conflictos; buenas prácticas de mensajes de commit y de historial limpio; versionar notebooks y scripts del proyecto.' },
  ],
  backend2: [
    { semana: '2–3', titulo: 'Clean Code y arquitectura limpia desde el inicio', justificacion: 'Tercer eslabón de la línea de Clean Code (tras Lógica y Backend I): al arrancar con la arquitectura de la API se consolidan las buenas prácticas a nivel de diseño, no solo de sintaxis.', temario: 'Clean Code aplicado a la arquitectura de una API REST: separación por capas (model, repository, service, controller); principios SOLID; nombres y responsabilidades claras; manejo limpio de errores y respuestas estandarizadas; uso de DTOs para no exponer entidades; código autoexplicativo.' },
    { semana: '5', titulo: 'Auditar la API con IA — identificar y explicar', justificacion: 'Primer nivel de auditoría con IA sobre Spring Boot: usar la IA para leer y explicar entidades y la estructura del proyecto, entendiendo el modelo de datos de la API.', temario: 'Uso de asistentes de IA para leer y explicar la configuración de un proyecto Spring Boot y sus entidades (@Entity, @Id, @GeneratedValue, @Column, relaciones); pedir a la IA que describa el modelo de datos; contrastar la explicación con la estructura del proyecto.' },
    { semana: '11', titulo: 'Auditar calidad y errores con IA — servicios y manejo de errores', justificacion: 'Segundo nivel: auditar con IA la capa de servicios y el manejo de errores, detectando lógica frágil y respuestas de error mal diseñadas.', temario: 'Auditoría con IA de la capa de servicios y el manejo de errores: orquestación de repositorios y mapeo DTO, excepciones personalizadas y respuestas de error estandarizadas (mensaje, código, timestamp); detección de lógica frágil y de fugas de la entidad; el estudiante valida y corrige la sugerencia de la IA.' },
    { semana: '15', titulo: 'Auditar, corregir y documentar con IA — controladores y Swagger', justificacion: 'Tercer nivel: auditar con IA los controladores y la documentación de la API, corregir y documentar, cerrando la auditoría responsable con IA sobre el servicio completo.', temario: 'Auditoría integral con IA de los controladores REST (@RestController, mapeo de rutas, uso de DTOs) y de la documentación con Swagger/OpenAPI; revisión de la coherencia de los endpoints y de la documentación generada; refactorización guiada y documentación de las correcciones; reflexión sobre el uso ético de la IA.' },
    { semana: '15–16', titulo: 'Desplegar la API en la nube con contenedores', justificacion: 'Cierra la línea de nube del programa: el estudiante empaqueta y despliega su API en la nube, la destreza más demandada para cerrar el ciclo de un desarrollo profesional.', temario: 'Despliegue de la API en la nube: contenerización con Docker (imagen y contenedor); publicación en un servicio de nube (Azure App Service o equivalente); configuración de variables de entorno y de la base de datos gestionada; nociones de integración y despliegue continuos (CI/CD) sobre el repositorio del proyecto.' },
    { semana: 'S3–18', continua: true, titulo: 'GitFlow avanzado con integración continua (uso sugerido en cada sesión)', justificacion: 'Máximo nivel de la línea de Git: el flujo profesional con revisión de código e integración continua sobre la API, tal como opera un equipo de desarrollo real.', temario: 'Uso sugerido de GitFlow avanzado a partir de la semana 3, en cada sesión: ramas feature por endpoint o capa; pull requests con revisión de código obligatoria; resolución de conflictos; verificación automática con integración continua (GitHub Actions) al abrir el PR; historial limpio y versionado de toda la API.' },
  ],
  frontend2: [
    { semana: '5', titulo: 'Auditar la app web con IA — identificar y explicar', justificacion: 'Primer nivel de auditoría con IA sobre el frontend con framework: usar la IA para leer y explicar la arquitectura web y las técnicas de desarrollo del módulo.', temario: 'Uso de asistentes de IA para leer y explicar la arquitectura web (tipos, mapas de navegación, integración de contenidos) y las técnicas y herramientas de desarrollo y diseño web; pedir a la IA que describa la estructura de la aplicación; contrastar la explicación con el proyecto.' },
    { semana: '11', titulo: 'Auditar calidad y seguridad con IA — riesgos y gestión de la información', justificacion: 'Segundo nivel: auditar con IA los riesgos del sitio y la gestión de la información, detectando vulnerabilidades y malas prácticas.', temario: 'Auditoría con IA de los riesgos de un sitio web y de la gestión de la información: procedimientos de respaldo y recuperación, protocolos de seguridad y criterios de almacenamiento; detección de vulnerabilidades comunes y de datos sensibles expuestos; el estudiante valida y corrige la sugerencia de la IA.' },
    { semana: '15', titulo: 'Auditar, corregir y documentar con IA — diseño y maquetación web', justificacion: 'Tercer nivel: auditar con IA el diseño y la maquetación del sitio, corregir y documentar, cerrando la auditoría responsable con IA sobre el producto final.', temario: 'Auditoría integral con IA del diseño y la maquetación web: estructura visual, técnicas de maquetación, parámetros de visualización y accesibilidad; revisión de la coherencia del diseño y de los estándares web; refactorización guiada y documentación de las mejoras; reflexión sobre el uso ético de la IA.' },
    { semana: 'S3–18', continua: true, titulo: 'GitFlow avanzado con pull requests revisados (uso sugerido en cada sesión)', justificacion: 'Cierra la línea de Git en el frontend del nivel III con el flujo profesional completo: ramas, revisión de código y despliegue continuo del sitio.', temario: 'Uso sugerido de GitFlow avanzado a partir de la semana 3, en cada sesión: ramas feature por vista o componente; pull requests con revisión de código entre pares; resolución de conflictos; conexión del repositorio con el despliegue continuo del sitio; historial limpio y versionado de todo el proyecto web.' },
  ],
};
