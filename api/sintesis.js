const { getDb } = require('../lib/mongo');
const { MATERIAS_INFO } = require('../lib/constants');

const SYSTEM = 'Eres un experto en diseño curricular por competencias para programas técnicos de desarrollo de software en Colombia. Conoces en profundidad el Marco Nacional de Cualificaciones (MNC, Decreto 1649 de 2021), el Sistema Nacional de Cualificaciones (SNC) y la demanda del sector TI en Medellín. Redactas siempre en español, en tercera persona y con un tono académico, claro y preciso.';

const BOOTCAMPS = {
  1: 'El Consultor como Intérprete — el estudiante aprende a interpretar necesidades, problemas y contextos del cliente.',
  2: 'El Arquitecto de Soluciones — el estudiante diseña y construye soluciones técnicas funcionales.',
  3: 'El Socio Tecnológico — el estudiante asesora, optimiza e integra soluciones de alto nivel.',
};

const CURRICULO = {
  logica: {
    modulo: 'Programación', horas: 72,
    unidades: 'U1: Elementos básicos de la lógica (30 h) — variables, constantes, operadores, algoritmos, pruebas de escritorio, decisiones, selector múltiple. U2: Estructuras lógicas (42 h) — ciclos (para, mientras, repita), acumuladores, contadores, funciones, arreglos unidimensionales, teoría de objetos.',
    saberSaber: 'Partes del computador, algoritmos, pseudocódigo, variables, tipos de datos, operadores aritméticos y lógicos, condicionales, selector múltiple, ciclos repetitivos, acumuladores, contadores, funciones, arreglos unidimensionales, conceptos de POO.',
    saberHacer: 'Construir algoritmos secuenciales y con decisiones, aplicar ciclos repetitivos, usar funciones para modularizar, manipular arreglos unidimensionales, validar con pruebas de escritorio.',
    saberSer: 'Pensamiento analítico, persistencia ante el error, responsabilidad, disposición para el aprendizaje autónomo.',
  },
  intro: {
    modulo: 'Web', horas: 72,
    unidades: 'U1: Maquetación de páginas web (28 h) — HTML5 semántico, etiquetas, formularios, Git básico. U2: Experiencia de usuarios UX/UI (44 h) — CSS3, Flexbox, Grid, Bootstrap/Tailwind, responsive design, media queries, animaciones, transiciones.',
    saberSaber: 'HTML5 (etiquetas semánticas, formularios, multimedia), CSS3 (selectores, modelo de caja, Flexbox, Grid), frameworks de estilos (Bootstrap, Tailwind), principios UX/UI, Git (repositorios, commits, ramas).',
    saberHacer: 'Maquetar páginas web semánticas con HTML5, aplicar estilos responsivos con CSS3 y Flexbox/Grid, utilizar frameworks CSS, versionar código con Git, diseñar experiencias de usuario adaptativas.',
    saberSer: 'Creatividad, atención al detalle, trabajo colaborativo, adaptabilidad al cambio tecnológico.',
  },
  bd: {
    modulo: 'Web', horas: 72,
    unidades: 'U1: Diseño de bases de datos (36 h) — modelos entidad-relación, normalización (1FN, 2FN, 3FN), BD no relacional. U2: Creación y administración de BD (36 h) — DDL/DML/DCL, SQL Server, JOIN, procedimientos almacenados, MongoDB, Power BI.',
    saberSaber: 'Modelos entidad-relación, normalización (1FN, 2FN, 3FN), SQL (DDL, DML, DCL), funciones de agregado, JOIN, procedimientos almacenados, MongoDB (documentos, colecciones), Power BI (conexiones, visualizaciones).',
    saberHacer: 'Diseñar modelos E-R normalizados, crear bases de datos en SQL Server, ejecutar consultas complejas con JOIN y subconsultas, crear procedimientos almacenados, operar MongoDB, generar visualizaciones con Power BI.',
    saberSer: 'Responsabilidad con la integridad de los datos, orden en la documentación, pensamiento lógico, ética en el manejo de información.',
  },
  agiles: {
    modulo: 'Programación', horas: 72, ncl: 'NCL 220501131',
    unidades: 'U1: Estructuración información preliminar (18 h) — modelo organizacional, técnicas de elicitación. U2: Consolidación de información (17 h) — reglas de negocio, análisis prospectivo. U3: Especificación de casos de uso (19 h) — diagramas, actores, relaciones. U4: Educción de requisitos (18 h) — jerarquización, categorización, priorización.',
    saberSaber: 'Modelo organizacional, técnicas de elicitación (entrevistas, encuestas, observación), reglas de negocio, análisis prospectivo, diagramas de casos de uso, actores, requisitos funcionales y no funcionales, priorización de requisitos.',
    saberHacer: 'Estructurar información del contexto organizacional, identificar reglas de negocio, especificar casos de uso con diagramas, educir y priorizar requisitos funcionales y no funcionales, documentar especificaciones de software.',
    saberSer: 'Escucha activa, comunicación asertiva, trabajo en equipo, pensamiento crítico, empatía con el cliente.',
  },
  backend1: {
    modulo: 'Movilidad', horas: 72,
    unidades: 'U1: Fundamentos de POO (36 h) — Java, clases, objetos, atributos, métodos, encapsulamiento, getters/setters, Git/GitHub. U2: Aplicación de POO (36 h) — herencia, polimorfismo, clases abstractas, interfaces, Maven/Gradle, JPA+Hibernate CRUD.',
    saberSaber: 'Paradigma orientado a objetos, clases, objetos, atributos, métodos, constructores, encapsulamiento, herencia, polimorfismo, clases abstractas, interfaces, Maven, JPA, Hibernate, patrón CRUD.',
    saberHacer: 'Crear clases Java con atributos y métodos, aplicar encapsulamiento con getters/setters, implementar herencia y polimorfismo, usar interfaces y clases abstractas, gestionar dependencias con Maven, persistir datos con JPA+Hibernate.',
    saberSer: 'Disciplina en las convenciones de código, responsabilidad con el versionamiento, disposición para la depuración, trabajo autónomo.',
  },
  frontend1: {
    modulo: 'Web', horas: 72,
    unidades: 'U1: Generalidades de JavaScript (35 h) — tipos de datos, variables, condicionales, ciclos, funciones, arreglos, objetos, desestructuración, DOM. U2: DOM de JavaScript (37 h) — selectores, Event Loop, callbacks, promesas, async/await, fetch, API REST.',
    saberSaber: 'JavaScript (tipos de datos, variables, operadores, condicionales, ciclos, funciones regulares/flecha/anónimas, arreglos, objetos, desestructuración), DOM (selectores, eventos), Event Loop, callbacks, promesas, async/await, fetch, API REST.',
    saberHacer: 'Programar lógica con JavaScript, manipular el DOM con selectores y eventos, consumir API REST con fetch y async/await, manejar promesas y callbacks, crear elementos dinámicamente.',
    saberSer: 'Curiosidad tecnológica, persistencia en la resolución de errores, colaboración en proyectos, comunicación técnica clara.',
  },
  nuevastec: {
    modulo: 'Programación', horas: 72,
    unidades: 'U1: Python e IAs (36 h) — Python fundamentals, IA (ANI/AGI/ASI), ética IA, ambientes virtuales (venv, conda). U2: Análisis de datos (36 h) — Pandas (DataFrame, Series), Matplotlib, Seaborn, reportes HTML.',
    saberSaber: 'Python (variables, condicionales, ciclos, funciones, listas, tuplas, diccionarios), inteligencia artificial (tipos, áreas, ética, ML vs DL), ambientes virtuales, Pandas (DataFrame, Series), Matplotlib, Seaborn, generación de reportes.',
    saberHacer: 'Programar en Python con estructuras nativas, configurar ambientes virtuales, analizar datos con Pandas, visualizar información con Matplotlib/Seaborn, generar reportes en HTML, evaluar aplicaciones de IA.',
    saberSer: 'Pensamiento crítico ante la IA, apertura a la innovación, responsabilidad ética, adaptabilidad a nuevas tecnologías.',
  },
  backend2: {
    modulo: 'Movilidad', horas: 72,
    unidades: 'U1: Generalidades del Framework (36 h) — API REST, JSON, MVC, patrón hexagonal, Spring Boot, Maven, JPA/Hibernate entidades y repositorios. U2: Implementación del Framework (36 h) — servicios, controladores, Swagger, DTOs, validación, pruebas unitarias JUnit.',
    saberSaber: 'API REST, JSON, patrón MVC, arquitectura por capas/hexagonal, Spring Boot, Maven, JPA/Hibernate (entidades, repositorios), servicios, controladores REST, Swagger/OpenAPI, DTOs, validación de datos, JUnit.',
    saberHacer: 'Configurar proyectos Spring Boot con Maven, mapear entidades con JPA/Hibernate, crear repositorios con consultas personalizadas, implementar servicios con inyección de dependencias, exponer endpoints REST, documentar con Swagger, escribir pruebas unitarias con JUnit.',
    saberSer: 'Rigurosidad en la documentación, compromiso con la calidad del código, pensamiento arquitectónico, disposición para pruebas y mejora continua.',
  },
  frontend2: {
    modulo: 'Web', horas: 72, ncl: 'NCL 220501123',
    unidades: 'U1: Estructuración de contenidos (27 h) — arquitectura web, comunicación, contenido web. U2: Maquetación de sitios web (23 h) — enlaces, bocetos, estructura visual. U3: Montaje de plataforma (22 h) — configuración, seguridad, dominio, despliegue, pruebas de carga.',
    saberSaber: 'Arquitectura web (componentes, protocolos), estructuración y secuenciación de contenidos, técnicas de diseño y maquetación, registro de dominio, configuración de servidores, reglas de seguridad, pruebas de carga y despliegue.',
    saberHacer: 'Estructurar contenidos web con técnicas de comunicación, maquetar con bocetos y árboles de contenido, configurar dominios y hosting, aplicar reglas de seguridad, transferir archivos a servidores, ejecutar pruebas de carga y despliegue.',
    saberSer: 'Responsabilidad con la calidad del producto final, orientación al detalle en seguridad, profesionalismo en la entrega, compromiso con la experiencia del usuario.',
  },
};

function construirPrompt(materiaId, nombreMateria, aportes, info) {
  const bloques = aportes.map((a, i) =>
    `Docente ${i + 1} (${a.profesor}):\n` +
    `- Comprensión del consultor: ${a.comprension || '(no registrada)'}\n` +
    `- Saber: ${a.saber || '(no registrado)'}\n` +
    `- Saber-hacer: ${a.saberHacer || '(no registrado)'}\n` +
    `- Saber-ser: ${a.saberSer || '(no registrado)'}`
  ).join('\n\n');

  const nivelDesc = BOOTCAMPS[info.nivel] || '';
  const cur = CURRICULO[materiaId] || {};

  let bloqueCurricular = '';
  if (cur.unidades) {
    bloqueCurricular = `
4. ESTRUCTURA CURRICULAR INSTITUCIONAL (FTCOCU-236, CESDE):
   - Módulo: ${cur.modulo} | Horas presenciales: ${cur.horas} h${cur.ncl ? ' | ' + cur.ncl : ''}
   - Unidades de aprendizaje: ${cur.unidades}
   - Tabla de saberes institucional:
     · Saber-saber: ${cur.saberSaber}
     · Saber-hacer: ${cur.saberHacer}
     · Saber-ser: ${cur.saberSer}
   - La síntesis DEBE ser coherente con esta estructura curricular oficial. Los aportes docentes complementan y enriquecen lo institucional, no lo contradicen.
`;
  }

  return `Objetivo: A partir de los aportes de los docentes sobre el perfil del «consultor» en el submódulo "${nombreMateria}" (Nivel ${info.nivel}, bootcamp: ${nivelDesc}) del programa Técnico Laboral como Asistente en Desarrollo de Software (CESDE, Medellín), construye UNA única definición consensuada que integre y sintetice las distintas visiones. Esta definición servirá como base para realizar los ajustes del programa.

Contexto normativo, sectorial e institucional que DEBE informar la síntesis:

1. MARCO NACIONAL DE CUALIFICACIONES (MNC — Decreto 1649 de 2021):
   - Los programas técnicos laborales corresponden a los niveles 1–4 del MNC (Decreto 923 de 2024).
   - Cada nivel se describe con tres dimensiones: Conocimientos (saber), Destrezas (saber-hacer, cognitivas y prácticas) y Actitudes (saber-ser, autonomía y responsabilidad).
   - La síntesis debe respetar el nivel de exigencia correspondiente al nivel técnico laboral, sin sobrevalorar ni subvalorar las competencias.

2. PERFIL CONSULTOR TECH:
   - El egresado se forma como «Consultor Tech»: no solo un programador, sino un profesional que interpreta necesidades del cliente, propone soluciones fundamentadas y acompaña su implementación.
   - Nivel I: Intérprete (traduce problemas en soluciones lógicas).
   - Nivel II: Arquitecto (diseña y construye soluciones técnicas).
   - Nivel III: Socio Tecnológico (asesora estratégicamente sobre tecnología).

3. DEMANDA DEL SECTOR TI EN MEDELLÍN:
   - Colombia proyecta un déficit de 85.000 talentos digitales al 2030 (MinTIC + Fedesoft, 2025).
   - Habilidades más demandadas: desarrollo full-stack, IA, cloud computing, DevOps, ciberseguridad, metodologías ágiles.
   - Se valoran perfiles híbridos: competencia técnica + habilidades blandas (comunicación, liderazgo, pensamiento estratégico).
   - Ruta N impulsa el ecosistema tech de Medellín con más de 480 empresas y 18.000 oportunidades de formación.
${bloqueCurricular}
Instrucciones:
- Integra los aportes sin repetir ideas; resuelve los solapamientos y unifica la terminología.
- Conserva lo esencial de cada docente y mantén un nivel de exigencia acorde a la formación técnica laboral.
- Asegúrate de que la síntesis refleje la alineación con el MNC, el perfil Consultor Tech y la demanda del sector en Medellín.
- Redacta en tercera persona y con tono académico.

Entrega la respuesta EXACTAMENTE con esta estructura:

Comprensión del consultor:
<un párrafo que defina cómo se entiende al consultor en este submódulo, vinculando con el MNC y el perfil Consultor Tech>

Saber (conocimientos):
<síntesis alineada con los descriptores del MNC para el nivel técnico laboral>

Saber-hacer (habilidades):
<síntesis que refleje destrezas cognitivas y prácticas pertinentes al sector TI de Medellín>

Saber-ser (actitudes y valores):
<síntesis que incluya autonomía, responsabilidad y habilidades blandas valoradas por el sector>

Al final, evalúa la alineación de este submódulo en cada dimensión con un número entero de 0 a 100. Usa EXACTAMENTE este formato en las últimas líneas de tu respuesta:

ALINEACION:
consultorTech: <número>
marcoNacional: <número>
sectorMedellin: <número>
empleabilidad: <número>
innovacionDidactica: <número>

Aportes de los docentes:
${bloques}`;
}

function parseAlineacion(text) {
  const match = text.match(/ALINEACION:\s*\n([\s\S]*?)$/i);
  if (!match) return null;
  const lines = match[1].trim().split('\n');
  const keys = ['consultorTech', 'marcoNacional', 'sectorMedellin', 'empleabilidad', 'innovacionDidactica'];
  const result = {};
  let found = 0;
  for (const line of lines) {
    for (const key of keys) {
      const re = new RegExp(key + '\\s*:\\s*(\\d+)', 'i');
      const m = line.match(re);
      if (m) { result[key] = Math.max(0, Math.min(100, parseInt(m[1], 10))); found++; }
    }
  }
  return found >= 3 ? result : null;
}

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Método no permitido' });
    }
    const b = req.body || {};
    const materiaId = String(b.materiaId || '').trim();
    const info = MATERIAS_INFO[materiaId];
    if (!info) return res.status(400).json({ error: 'materiaId inválido' });

    const db = await getDb();
    const aportes = await db.collection('aportes').find({ materiaId }).toArray();
    if (!aportes.length) {
      return res.status(400).json({ error: 'Aún no hay aportes de docentes para sintetizar en este submódulo.' });
    }

    const prompt = construirPrompt(materiaId, info.nombre, aportes, info);
    if (b.soloPrompt) return res.status(200).json({ prompt });

    const key = process.env.GROQ_API_KEY;
    if (!key) return res.status(500).json({ error: 'Falta la variable de entorno GROQ_API_KEY' });

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        temperature: 0.4,
        messages: [
          { role: 'system', content: SYSTEM },
          { role: 'user', content: prompt },
        ],
      }),
    });

    const data = await groqRes.json();
    if (!groqRes.ok) {
      return res.status(502).json({ error: 'IA: ' + ((data.error && data.error.message) || groqRes.status) });
    }
    const raw = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!raw) return res.status(502).json({ error: 'La IA no devolvió contenido.' });

    const alineacionIA = parseAlineacion(raw);
    let sintesis = raw.trim();
    if (alineacionIA) {
      sintesis = sintesis.replace(/\n*ALINEACION:[\s\S]*$/, '').trim();
      await db.collection('materias').updateOne(
        { materiaId },
        { $set: { alineacionIA, alineacionIAFecha: new Date() } },
        { upsert: true }
      );
    }

    return res.status(200).json({ prompt, sintesis, alineacionIA });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
