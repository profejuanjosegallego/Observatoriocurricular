const { MATERIAS_INFO, NIVELES } = require('../lib/constants');

const SYSTEM = 'Eres un experto en diseño curricular por competencias para programas técnicos de desarrollo de software en Colombia (CESDE, Medellín). Diseñas proyectos integradores y propuestas didácticas semanales alineados al perfil del «Consultor Tech». Redactas siempre en español, en tercera persona y con un tono académico, claro y preciso. No uses markdown. No uses asteriscos ni negritas. Cuando describas entregables técnicos, sé EXTREMADAMENTE ESPECÍFICO: menciona nombres de tablas con columnas, nombres de archivos HTML con secciones, nombres de funciones con parámetros, consultas SQL con cláusulas concretas. Nunca uses frases genéricas como "se crea la base de datos" o "se implementa la lógica".';

const NIVEL_CONTEXTO = {
  1: {
    modelo: 'Data-First',
    perfil: 'El Consultor como Intérprete — traduce problemas en soluciones lógicas',
    materias: ['bd', 'intro', 'logica'],
    lider: 'bd',
    liderRol: 'PM Logístico',
    tecnico: 'SQL básico (DDL/DML, MER, normalización 1FN-3FN, procedimientos almacenados), HTML5 semántico + CSS3 (Flexbox, Grid, responsive, Bootstrap/Tailwind), y Lógica de Programación (pseudocódigo, Java básico: variables, operadores, condicionales, ciclos, arreglos, funciones). Las tres capas trabajan desconectadas pero convergen a través del Modelo Relacional.',
  },
  2: {
    modelo: 'Agile-First',
    perfil: 'El Arquitecto de Soluciones — diseña y construye soluciones técnicas funcionales',
    materias: ['agiles', 'backend1', 'frontend1'],
    lider: 'agiles',
    liderRol: 'PMO / Agile Coach',
    tecnico: 'Metodologías Ágiles (Scrum, Kanban, historias de usuario, Sprint Planning, Retrospectiva), Java POO (herencia, polimorfismo, clases abstractas, interfaces, JPA+Hibernate CRUD), y JavaScript (DOM, eventos, fetch, async/await, localStorage). Ágiles actúa como PMO, Backend y Frontend como Dev Teams paralelos.',
  },
  3: {
    modelo: 'API-First',
    perfil: 'El Socio Tecnológico — asesora, optimiza e integra soluciones de alto nivel',
    materias: ['backend2', 'frontend2', 'nuevastec'],
    lider: 'backend2',
    liderRol: 'Arquitecto de Producto',
    tecnico: 'Spring Boot + API REST + Swagger + JUnit + DTOs, React (SPA, Router, useState/useEffect, consumo API con fetch/axios), y Python (Pandas, Matplotlib, Seaborn, análisis de datos) + Git/GitFlow. La API REST es la fuente única de verdad.',
  },
};

function buildProyectoPrompt(idea, nivel) {
  const nv = NIVEL_CONTEXTO[nivel];
  const materiasList = nv.materias.map(m => `${m} (${MATERIAS_INFO[m].nombre})`).join(', ');
  const liderNombre = MATERIAS_INFO[nv.lider].nombre;
  const apoyoMaterias = nv.materias.filter(m => m !== nv.lider);

  return `IDEA CENTRAL: "${idea}"
NIVEL: ${NIVELES[nivel].nombre}
MODELO: ${nv.modelo} — ${nv.perfil}
MATERIAS: ${materiasList}
MATERIA LIDER: ${liderNombre} (rol: ${nv.liderRol})
CAPACIDADES TECNICAS DEL NIVEL: ${nv.tecnico}

Genera un PROYECTO INTEGRADOR completo y realista para estudiantes de un programa técnico laboral (18 semanas, 72 horas por materia, 4 h semanales).

REGLAS CRITICAS PARA LOS ENTREGABLES — léelas antes de escribir:
1. Cada entregable DEBE mencionar artefactos técnicos CONCRETOS del dominio "${idea}":
   - Si es BD: nombres de tablas con sus columnas principales. Ejemplo: "Diagrama E-R con tablas Producto(id, nombre, categoria_id, precio, stock), Categoria(id, nombre), Proveedor(id, nombre, contacto, direccion)"
   - Si es Interfaz/Frontend: pantallas específicas con sus elementos. Ejemplo: "Página listado-productos.html con tabla de productos por categoría, formulario de búsqueda por nombre y barra lateral de filtros por proveedor"
   - Si es Lógica/Backend: procesos y funciones específicas. Ejemplo: "Pseudocódigo del proceso RegistrarProducto que lea nombre, precio, categoría y stock, valide que el precio sea positivo y lo agregue al arreglo de inventario"
   - Si es Ágiles: historias de usuario concretas. Ejemplo: "Como administrador de restaurante quiero registrar un plato con su receta e ingredientes para controlar los costos"
2. NO uses frases genéricas como "diseñar la base de datos", "crear la interfaz", "implementar la lógica". Eso NO sirve.
3. Cada detalle debe ser tan específico que el estudiante sepa EXACTAMENTE qué hacer sin preguntar.
4. El lenguaje debe ser claro para cualquier persona.

Responde con EXACTAMENTE esta estructura. Usa los encabezados tal cual, cada uno en su propia línea:

TITULO: <nombre creativo del proyecto que incluya la temática, máximo 8 palabras>

DESCRIPCION: <párrafo de 3-4 líneas describiendo el proyecto en contexto empresarial real de "${idea}">

OBJETIVO: <objetivo de aprendizaje integrador en una oración, vinculado a "${idea}">

CONCEPTO: <frase corta que resume la filosofía del proyecto, máximo 10 palabras>

CONCEPTO_DETALLE: <párrafo explicando cómo funciona la integración entre las tres materias APLICADA a "${idea}">

LIDER: ${nv.lider}
LIDER_ROL: <nombre del rol>
LIDER_RAZON: <por qué esta materia lidera en el contexto de "${idea}">

${apoyoMaterias.map(m => `APOYO: ${m}
APOYO_ROL: <rol que cumple ${MATERIAS_INFO[m].nombre}>
APOYO_DESC: <cómo contribuye al proyecto de "${idea}">`).join('\n\n')}

AVANCE_1:
SEMANA: 6
NOMBRE: <nombre descriptivo>
${nv.materias.map(m => `${m}_TITULO: <título específico sobre "${idea}">
${m}_DETALLE: <SÉ CONCRETO como este ejemplo — BD: "Diagrama E-R con tablas Producto(id, nombre, categoria_id, precio, stock), Categoria(id, nombre, descripcion), Proveedor(id, nombre, telefono, direccion). Script DDL con CREATE TABLE, PRIMARY KEY, FOREIGN KEY. INSERT de 5 productos de prueba: (1,'Arroz Diana',1,4500,100), (2,'Aceite Girasol',1,12000,50)..." — Frontend: "Archivo listado-productos.html con tabla <table> de productos organizados por categoría, formulario <form> con campos nombre, precio y select de categoría. Archivo style.css con Flexbox para layout de 2 columnas" — Lógica: "Pseudocódigo del proceso RegistrarProducto(nombre, precio, stock) que valide precio>0 y stock>=0, lo agregue al arreglo inventario[] y muestre confirmación" — Adapta al dominio de "${idea}">`).join('\n')}

AVANCE_2:
SEMANA: 12
NOMBRE: <nombre descriptivo>
${nv.materias.map(m => `${m}_TITULO: <título específico sobre "${idea}">
${m}_DETALLE: <SÉ CONCRETO como este ejemplo — BD: "Script SQL con INSERT de 20 registros en Producto y 10 en Proveedor. Consultas: SELECT p.nombre, c.nombre FROM Producto p JOIN Categoria c ON p.categoria_id=c.id WHERE p.stock<10. Vista VistaInventarioBajo que muestre productos con stock menor a 10 unidades" — Frontend: "Archivo detalle-producto.html con CSS Grid de 3 columnas para ficha de producto (imagen, datos, stock). Formulario editar-producto.html con validación HTML5 required y type=number para precio" — Lógica: "Archivo Inventario.java con variables String nombre, int precio, int stock. Función calcularValorTotal() que recorra el arreglo y sume precio*stock. Impresión formateada en consola" — Adapta al dominio de "${idea}">`).join('\n')}

AVANCE_3:
SEMANA: 17
NOMBRE: <nombre descriptivo>
${nv.materias.map(m => `${m}_TITULO: <título específico sobre "${idea}">
${m}_DETALLE: <SÉ CONCRETO como este ejemplo — BD: "Procedimiento almacenado ConsultarVentasPorMes(@mes INT) con JOIN entre Pedido, DetallePedido y Producto, GROUP BY categoria. Consulta SELECT c.nombre, COUNT(*), SUM(dp.cantidad*p.precio) FROM ... con HAVING SUM>50000 para categorías más rentables" — Frontend: "Página dashboard.html responsive con Bootstrap: tabla resumen de stock bajo (stock<10), sección de últimos pedidos con badges de estado, formulario de reposición con select de proveedor y validación" — Lógica: "Programa Java con menú switch/while: 1)Listar productos, 2)Buscar por nombre, 3)Agregar al carrito, 4)Calcular total con IVA. Función buscarProducto(String nombre) que recorra el arreglo y retorne coincidencias" — Adapta al dominio de "${idea}">`).join('\n')}

INTEGRACION: <cómo se integran las tres materias para resolver el problema de "${idea}", qué artefacto las conecta>`;
}

function parseProyecto(raw, nivel) {
  const nv = NIVEL_CONTEXTO[nivel];
  const g = (key) => {
    const re = new RegExp(key + ':\\s*(.+)', 'i');
    const m = raw.match(re);
    return m ? m[1].trim() : '';
  };

  const avances = [];
  for (let i = 1; i <= 3; i++) {
    const section = raw.match(new RegExp(`AVANCE_${i}:[\\s\\S]*?(?=AVANCE_${i+1}:|INTEGRACION:|$)`, 'i'));
    if (!section) continue;
    const block = section[0];
    const porMateria = {};
    for (const mid of nv.materias) {
      const tRe = new RegExp(mid + '_TITULO:\\s*(.+)', 'i');
      const dRe = new RegExp(mid + '_DETALLE:\\s*([\\s\\S]*?)(?=\\w+_TITULO:|\\w+_DETALLE:|AVANCE_|INTEGRACION:|$)', 'i');
      const tM = block.match(tRe);
      const dM = block.match(dRe);
      if (tM || dM) {
        porMateria[mid] = {
          titulo: tM ? tM[1].trim() : '',
          detalle: dM ? dM[1].trim().replace(/\n+/g, ' ') : '',
        };
      }
    }
    const semRe = block.match(/SEMANA:\s*(\d+)/i);
    const nomRe = block.match(/NOMBRE:\s*(.+)/i);
    avances.push({
      semana: semRe ? parseInt(semRe[1]) : [6, 12, 17][i - 1],
      nombre: nomRe ? nomRe[1].trim() : `Avance ${i}`,
      porMateria,
    });
  }

  const apoyo = [];
  const apoyoBlocks = raw.matchAll(/APOYO:\s*(\w+)\s*\n\s*APOYO_ROL:\s*(.+)\s*\n\s*APOYO_DESC:\s*(.+)/gi);
  for (const m of apoyoBlocks) {
    apoyo.push({ materia: m[1].trim(), rol: m[2].trim(), descripcion: m[3].trim() });
  }

  return {
    titulo: g('TITULO'),
    descripcion: g('DESCRIPCION'),
    objetivo: g('OBJETIVO'),
    concepto: g('CONCEPTO'),
    conceptoDetalle: g('CONCEPTO_DETALLE'),
    lider: g('LIDER'),
    liderRol: g('LIDER_ROL'),
    liderRazon: g('LIDER_RAZON'),
    apoyo,
    avances,
    integracion: g('INTEGRACION'),
    modelo: nv.modelo,
  };
}

function buildDidacticasPrompt(idea, nivel, proyectoTexto) {
  const nv = NIVEL_CONTEXTO[nivel];
  const materiasList = nv.materias.map(m => `${m} (${MATERIAS_INFO[m].nombre})`).join(', ');

  return `PROYECTO INTEGRADOR: "${idea}" — ${NIVELES[nivel].nombre}
CONTEXTO DEL PROYECTO:
${proyectoTexto}

MATERIAS: ${materiasList}
Cada materia tiene 72 horas presenciales (4 horas semanales, 18 semanas).

Propón cómo trabajar este proyecto desde las didácticas de clase, semana a semana, para CADA materia.

Reglas:
- Semanas 1-5: preparan el Avance 1 (entrega en S6)
- Semana 6: ENTREGA del Avance 1
- Semanas 7-11: preparan el Avance 2 (entrega en S12)
- Semana 12: ENTREGA del Avance 2
- Semanas 13-16: preparan el Avance 3 (entrega en S17)
- Semana 17: ENTREGA del Avance 3
- Semana 18: BOOTCAMP (evento final de un día con empresa invitada)
- Cada semana debe vincular contenido curricular con una actividad práctica que avance el proyecto
- Sé concreto: qué tema de clase y qué actividad vinculada al proyecto

Responde con EXACTAMENTE este formato para cada materia:

MATERIA: <id>
S1: <tema de clase> | <actividad vinculada al proyecto>
S2: <tema de clase> | <actividad vinculada al proyecto>
...hasta S18
(repite para cada materia)`;
}

function parseDidacticas(raw, nivel) {
  const nv = NIVEL_CONTEXTO[nivel];
  const result = {};

  for (const mid of nv.materias) {
    const re = new RegExp(`MATERIA:\\s*${mid}[\\s\\S]*?(?=MATERIA:|$)`, 'i');
    const block = raw.match(re);
    if (!block) continue;

    const semanas = [];
    const lines = block[0].split('\n');
    for (const line of lines) {
      const sm = line.match(/S(\d+):\s*(.+)/i);
      if (sm) {
        const parts = sm[2].split('|').map(s => s.trim());
        semanas.push({
          semana: parseInt(sm[1]),
          tema: parts[0] || '',
          actividad: parts[1] || parts[0] || '',
        });
      }
    }
    result[mid] = semanas;
  }

  return result;
}

const NIVEL_ALCANCE = {
  1: {
    permitido: 'Modelo Entidad-Relación y Modelo Relacional (normalización de 1FN a 3FN); SQL: DDL (CREATE TABLE, claves primarias y foráneas, integridad referencial), DML (INSERT, SELECT, UPDATE, DELETE), JOINs simples, funciones agregadas (COUNT, SUM, AVG) y procedimientos almacenados básicos; HTML5 semántico (header, main, section, article, formularios, tablas); CSS3 (modelo de caja, Flexbox, Grid, diseño responsive con media queries o un framework como Bootstrap o Tailwind); pseudocódigo y diagramas de flujo; Java básico de consola (variables, tipos de datos, operadores, condicionales, ciclos, arreglos, funciones, menús con switch y while, simulación de operaciones CRUD con arreglos en memoria).',
    prohibido: 'API REST, endpoints, verbos HTTP, JSON como contrato, Spring Boot, JPA, Hibernate, cualquier framework de backend, React, Angular, Vue, SPA, JavaScript del lado del cliente (manipulación del DOM, eventos, fetch, async/await, promesas, localStorage), Python, Pandas, analítica de datos, programación orientada a objetos avanzada (herencia, polimorfismo, clases abstractas, interfaces), Git o GitFlow, Docker, despliegue en la nube, autenticación o JWT.',
  },
  2: {
    permitido: 'Metodologías ágiles (Scrum y Kanban): historias de usuario con criterios de aceptación, Product Backlog, Sprint Planning, Daily Standup, Sprint Review, Retrospectiva, tablero Kanban y burndown chart; Java con Programación Orientada a Objetos (clases, objetos, encapsulamiento, constructores, getters y setters, herencia, polimorfismo, clases abstractas, interfaces, ArrayList y colecciones) y persistencia con JPA + Hibernate (CRUD); JavaScript del lado del cliente (manipulación del DOM, eventos, fetch, async/await, promesas, localStorage); HTML y CSS ya dominados del Nivel I.',
    prohibido: 'Spring Boot, API REST formal documentada con Swagger, DTOs, JUnit, React o cualquier SPA, React Router, Python, Pandas, Matplotlib, analítica de datos, Git/GitFlow como contenido central, microservicios, Docker o despliegue en la nube (esos contenidos pertenecen al Nivel III).',
  },
  3: {
    permitido: 'Spring Boot con arquitectura por capas; API REST con controladores (@GetMapping, @PostMapping, @PutMapping, @DeleteMapping), capa de servicios e inyección de dependencias; entidades JPA con relaciones; repositorios con JPQL; DTOs con validación; documentación con Swagger/OpenAPI; pruebas unitarias con JUnit; React (componentes funcionales, useState, useEffect, React Router, consumo de la API con fetch o axios); Python (Pandas, Matplotlib, Seaborn) para análisis y visualización de datos; Git y GitFlow.',
    prohibido: 'Tecnologías fuera del alcance del programa técnico: Kubernetes, aprendizaje automático o inteligencia artificial, lenguajes no vistos (Go, Rust, C#), arquitecturas de microservicios con colas de mensajería, o cualquier herramienta que no haga parte de las materias del nivel.',
  },
};

function buildBootcampPrompt(reto, nivel) {
  const nv = NIVEL_CONTEXTO[nivel];
  const al = NIVEL_ALCANCE[nivel];
  const materiasList = nv.materias.map(m => `${m} (${MATERIAS_INFO[m].nombre})`).join(', ');

  return `RETO EMPRESARIAL: "${reto}"
NIVEL: ${NIVELES[nivel].nombre}
MODELO: ${nv.modelo} — ${nv.perfil}
MATERIAS DEL NIVEL (y solo estas): ${materiasList}

ALCANCE TECNICO PERMITIDO (los estudiantes SOLO saben y solo deben usar esto):
${al.permitido}

TECNOLOGIAS Y CONCEPTOS PROHIBIDOS (NO pueden aparecer bajo ninguna circunstancia):
${al.prohibido}

Diseña la AGENDA y la RUBRICA de un BOOTCAMP de un día (jornada completa de 8:00 a 17:00) en el que los estudiantes resuelven el reto empresarial "${reto}" aplicando ÚNICAMENTE el alcance técnico permitido del nivel. El bootcamp es el evento de cierre del nivel: una empresa invitada del territorio antioqueño presenta un reto real y, al final del día, los equipos sustentan su solución ante el cliente.

REGLAS CRITICAS — léelas antes de escribir:
1. ADHERENCIA AL NIVEL: usa exclusivamente el alcance técnico permitido. Si mencionas cualquier cosa de la lista de prohibidos, la respuesta es incorrecta. Por ejemplo, en el Nivel I jamás se habla de API, de JavaScript ni de frameworks: se trabaja con SQL, HTML/CSS y lógica/Java de consola.
2. SE EXTREMADAMENTE EXPLICITO: cada actividad y cada entregable debe decir EXACTAMENTE qué construye el estudiante, con artefactos concretos del dominio "${reto}" y nombres reales (tablas con sus columnas, archivos .html con sus secciones, funciones con sus parámetros, consultas SQL con sus cláusulas, historias de usuario redactadas, clases con sus atributos). NUNCA uses frases vagas como "programar la solución", "hacer la base de datos" o "desarrollar el sistema".
3. La jornada incluye, en este orden: presentación del reto por la empresa invitada, conformación de equipos y análisis del problema, uno o dos bloques de desarrollo técnico en la mañana, un almuerzo (12:00 – 13:00), refinamiento y preparación de la sustentación en la tarde, la sustentación ante la empresa y un cierre con retroalimentación.
4. Cada bloque de la agenda debe tener entre 2 y 4 temáticas concretas.
5. La RUBRICA debe tener exactamente 5 criterios cuyos pesos sumen 100, con tres niveles de desempeño claramente diferenciados y observables.
6. Redacta en español impecable, en tercera persona, sin markdown, sin asteriscos ni negritas.

Responde EXACTAMENTE con este formato, respetando cada encabezado en su propia línea:

NOMBRE: <nombre del bootcamp para este reto, máximo 8 palabras>
OBJETIVO: <objetivo del bootcamp en una o dos oraciones, vinculado al reto>
RETO: <reformulación del reto empresarial contextualizada, de 2 a 3 líneas, tal como lo presentaría la empresa invitada>

AGENDA:
BLOQUE
HORA: 8:00 – 8:30
ACTIVIDAD: <nombre de la actividad>
TEMATICAS: <temática concreta 1> || <temática concreta 2> || <temática concreta 3>
BLOQUE
HORA: 8:30 – 9:30
ACTIVIDAD: <nombre de la actividad>
TEMATICAS: <temática concreta 1> || <temática concreta 2>
(continúa con tantos bloques BLOQUE como necesites hasta cubrir la jornada hasta las 17:00; separa cada bloque con una línea que contenga únicamente la palabra BLOQUE)

COMPETENCIAS:
COMP: <competencia observable que se demuestra 1>
COMP: <competencia 2>
COMP: <competencia 3>
COMP: <competencia 4>
COMP: <competencia 5>

ENTREGABLES:
ENT: <entregable concreto y verificable 1, nombrando el artefacto exacto que se entrega>
ENT: <entregable 2>
ENT: <entregable 3>
ENT: <entregable 4>
ENT: <entregable 5>

RUBRICA:
CRITERIO
NOMBRE: <nombre del criterio de evaluación>
PESO: <número entero de porcentaje>
SUPERIOR: <descriptor observable del desempeño superior>
ACEPTABLE: <descriptor observable del desempeño aceptable>
INICIAL: <descriptor observable del desempeño en desarrollo>
CRITERIO
(repite hasta tener exactamente 5 criterios cuyos pesos sumen 100, separando cada uno con una línea que contenga únicamente la palabra CRITERIO)`;
}

function parseBootcamp(raw, nivel) {
  const nv = NIVEL_CONTEXTO[nivel];
  const g = (key) => {
    const re = new RegExp(key + ':\\s*(.+)', 'i');
    const m = raw.match(re);
    return m ? m[1].trim() : '';
  };

  // Reto (puede ocupar varias líneas hasta la sección AGENDA)
  const retoM = raw.match(/RETO:\s*([\s\S]*?)(?=\n\s*AGENDA:|$)/i);
  const reto = retoM ? retoM[1].trim().replace(/\s*\n+\s*/g, ' ') : '';

  // Agenda
  const agenda = [];
  const agendaSec = raw.match(/AGENDA:([\s\S]*?)(?=COMPETENCIAS:|ENTREGABLES:|RUBRICA:|$)/i);
  if (agendaSec) {
    const blocks = agendaSec[1].split(/^[ \t]*BLOQUE[ \t]*$/im).map(b => b.trim()).filter(Boolean);
    for (const block of blocks) {
      const horaM = block.match(/HORA:\s*(.+)/i);
      const actM = block.match(/ACTIVIDAD:\s*(.+)/i);
      const temM = block.match(/TEMATICAS:\s*([\s\S]+)/i);
      if (!horaM || !actM) continue;
      const tematicas = temM
        ? temM[1].split('||').map(t => t.trim().replace(/\s*\n+\s*/g, ' ')).filter(Boolean)
        : [];
      agenda.push({ hora: horaM[1].trim(), actividad: actM[1].trim(), tematicas });
    }
  }

  // Competencias
  const competencias = [];
  const compSec = raw.match(/COMPETENCIAS:([\s\S]*?)(?=ENTREGABLES:|RUBRICA:|$)/i);
  if (compSec) {
    for (const m of compSec[1].matchAll(/COMP:\s*(.+)/gi)) competencias.push(m[1].trim());
  }

  // Entregables
  const entregables = [];
  const entSec = raw.match(/ENTREGABLES:([\s\S]*?)(?=RUBRICA:|$)/i);
  if (entSec) {
    for (const m of entSec[1].matchAll(/ENT:\s*(.+)/gi)) entregables.push(m[1].trim());
  }

  // Rúbrica
  const rubrica = [];
  const rubSec = raw.match(/RUBRICA:([\s\S]*)$/i);
  if (rubSec) {
    const blocks = rubSec[1].split(/^[ \t]*CRITERIO[ \t]*$/im).map(b => b.trim()).filter(Boolean);
    const sub = (block, key) => {
      const re = new RegExp(key + ':\\s*([\\s\\S]*?)(?=\\n[ \\t]*(?:NOMBRE|PESO|SUPERIOR|ACEPTABLE|INICIAL):|$)', 'i');
      const m = block.match(re);
      return m ? m[1].trim().replace(/\s*\n+\s*/g, ' ') : '';
    };
    for (const block of blocks) {
      const nombreM = block.match(/NOMBRE:\s*(.+)/i);
      if (!nombreM) continue;
      const pesoM = block.match(/PESO:\s*(\d+)/i);
      rubrica.push({
        criterio: nombreM[1].trim(),
        peso: pesoM ? parseInt(pesoM[1]) : null,
        superior: sub(block, 'SUPERIOR'),
        aceptable: sub(block, 'ACEPTABLE'),
        inicial: sub(block, 'INICIAL'),
      });
    }
  }

  return {
    nombre: g('NOMBRE'),
    objetivo: g('OBJETIVO'),
    reto,
    agenda,
    competencias,
    entregables,
    rubrica,
    materias: nv.materias,
    modelo: nv.modelo,
  };
}

async function callGroq(systemPrompt, userPrompt) {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error('Falta la variable de entorno GROQ_API_KEY');

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
      temperature: 0.6,
      max_tokens: 5000,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  });

  const data = await groqRes.json();
  if (!groqRes.ok) {
    const msg = (data.error && data.error.message) || String(groqRes.status);
    if (msg.includes('Rate limit')) {
      const wait = msg.match(/try again in ([\d.]+)s/i);
      const secs = wait ? Math.ceil(parseFloat(wait[1])) : 15;
      const err = new Error(`Límite de tokens alcanzado. Reintentando en ${secs} segundos...`);
      err.rateLimited = true;
      err.retrySecs = secs;
      throw err;
    }
    throw new Error('IA: ' + msg);
  }
  const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
  if (!content) throw new Error('La IA no devolvió contenido.');

  const usage = data.usage || {};
  return { content, usage };
}

async function callGroqWithRetry(systemPrompt, userPrompt) {
  for (let i = 0; i < 3; i++) {
    try {
      return await callGroq(systemPrompt, userPrompt);
    } catch (e) {
      if (e.rateLimited && i < 2) {
        await new Promise(r => setTimeout(r, (e.retrySecs + 2) * 1000));
        continue;
      }
      throw e;
    }
  }
}

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ error: 'Método no permitido' });
    }

    const { idea, nivel, tipo, contextoProyecto } = req.body || {};
    const nv = parseInt(nivel);
    if (!idea || !idea.trim()) return res.status(400).json({ error: 'Debe proporcionar una idea para el proyecto.' });
    if (![1, 2, 3].includes(nv)) return res.status(400).json({ error: 'El nivel debe ser 1, 2 o 3.' });

    if (tipo === 'didacticas') {
      if (!contextoProyecto) return res.status(400).json({ error: 'Se requiere el contexto del proyecto generado.' });
      const prompt = buildDidacticasPrompt(idea.trim(), nv, contextoProyecto);
      const { content: raw, usage } = await callGroqWithRetry(SYSTEM, prompt);
      const didacticas = parseDidacticas(raw, nv);
      return res.status(200).json({ didacticas, raw, usage });
    }

    if (tipo === 'bootcamp') {
      const prompt = buildBootcampPrompt(idea.trim(), nv);
      const { content: raw, usage } = await callGroqWithRetry(SYSTEM, prompt);
      const bootcamp = parseBootcamp(raw, nv);
      return res.status(200).json({ bootcamp, raw, usage });
    }

    const prompt = buildProyectoPrompt(idea.trim(), nv);
    const { content: raw, usage } = await callGroqWithRetry(SYSTEM, prompt);
    const proyecto = parseProyecto(raw, nv);
    return res.status(200).json({ proyecto, raw, usage });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
