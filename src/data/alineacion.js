export const DIMENSIONES = [
  { key: 'consultorTech', nombre: 'Perfil Consultor Tech' },
  { key: 'marcoNacional', nombre: 'Marco Nacional (MNC)' },
  { key: 'sectorMedellin', nombre: 'Sector TI Medellín' },
  { key: 'empleabilidad', nombre: 'Empleabilidad directa' },
  { key: 'innovacionDidactica', nombre: 'Innovación pedagógica' },
];

export const ALINEACION = {
  logica: {
    consultorTech: 75,
    marcoNacional: 90,
    sectorMedellin: 62,
    empleabilidad: 58,
    innovacionDidactica: 82,
  },
  intro: {
    consultorTech: 65,
    marcoNacional: 80,
    sectorMedellin: 55,
    empleabilidad: 52,
    innovacionDidactica: 85,
  },
  bd: {
    consultorTech: 80,
    marcoNacional: 88,
    sectorMedellin: 78,
    empleabilidad: 80,
    innovacionDidactica: 72,
  },
  agiles: {
    consultorTech: 88,
    marcoNacional: 82,
    sectorMedellin: 68,
    empleabilidad: 65,
    innovacionDidactica: 90,
  },
  backend1: {
    consultorTech: 78,
    marcoNacional: 88,
    sectorMedellin: 80,
    empleabilidad: 78,
    innovacionDidactica: 75,
  },
  frontend1: {
    consultorTech: 72,
    marcoNacional: 84,
    sectorMedellin: 76,
    empleabilidad: 74,
    innovacionDidactica: 82,
  },
  nuevastec: {
    consultorTech: 92,
    marcoNacional: 76,
    sectorMedellin: 88,
    empleabilidad: 82,
    innovacionDidactica: 90,
  },
  backend2: {
    consultorTech: 85,
    marcoNacional: 84,
    sectorMedellin: 75,
    empleabilidad: 72,
    innovacionDidactica: 74,
  },
  frontend2: {
    consultorTech: 82,
    marcoNacional: 82,
    sectorMedellin: 72,
    empleabilidad: 75,
    innovacionDidactica: 78,
  },
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
    metodologia: '8 entrevistas cualitativas semiestructuradas: 3 empresas de software, 1 empresa 360 y 4 empresas de capital humano (Antioquia, 2026).',
    fuente: 'CESDE · Comfama',
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
];

export const CONTEXTO_SECTOR = {
  resumen: 'El sector TI de Medellín proyecta un déficit de entre 68.000 y 112.000 desarrolladores a nivel nacional. Las habilidades más demandadas incluyen desarrollo full-stack, inteligencia artificial, computación en la nube (AWS, Azure, GCP), DevOps/CI-CD, ciberseguridad y metodologías ágiles. Ruta N ha impulsado más de 480 empresas tech en la ciudad y ofrece más de 18.000 oportunidades de formación tecnológica al año. Los perfiles híbridos que combinan competencia técnica con habilidades blandas (comunicación, liderazgo, pensamiento estratégico) son los más valorados por las empresas.',
  fuentes: 'MinTIC + Fedesoft (2025), Ruta N (2024–2025), La República, Portafolio.',
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
    { eje: 'Tecnológico', actual: 'Java, SQL, Spring', demanda: 'IA, Nube (Azure/AWS), CI/CD', accion: 'Integrar Cloud Fundamentals e IA aplicada al desarrollo' },
    { eje: 'Funcional', actual: 'Configuración de hardware', demanda: 'Lógica de negocio y UI', accion: 'Eliminar módulos de hardware; agregar traducción de requisitos' },
    { eje: 'Metodológico', actual: 'Scrum básico', demanda: 'Agilismo real (Jira/Trello), GitFlow', accion: 'Migrar Git a flujo empresarial (GitFlow)' },
    { eje: 'Humano', actual: 'Ética general', demanda: 'Comunicación asertiva, adaptabilidad', accion: 'Talleres de manejo de la frustración y comunicación técnica' },
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
  logica: [
    {
      semana: '5–6',
      tema: 'Principios de Clean Code aplicados a pseudocódigo',
      justificacion: 'El panel de pertinencia señala que la IA facilitará la sintaxis, pero el estudiante debe auditar la calidad del código. Incorporar criterios de legibilidad y nombres significativos forma el saber-hacer que exige el MNC para el nivel técnico.',
      fuentes: ['Pertinencia', 'MNC'],
    },
    {
      semana: '10–11',
      tema: 'Auditoría de código generado por IA',
      justificacion: 'Los expertos recomiendan que el estudiante evalúe críticamente lo que produce una IA: ¿es correcto? ¿Es limpio? ¿Resuelve el problema? Refuerza el pensamiento lógico sin depender de la memorización de sintaxis.',
      fuentes: ['Pertinencia'],
    },
    {
      semana: '14–15',
      tema: 'Retos de lógica con contexto empresarial de Medellín',
      justificacion: 'El testeo empresarial identifica la comprensión del negocio como brecha crítica. Plantear problemas de inventario, nómina o logística conecta la lógica con el mundo laboral sin exceder el nivel técnico.',
      fuentes: ['Testeo empresarial', 'MNC'],
    },
    {
      semana: '17',
      tema: 'Validación tipo consultoría: prueba de escritorio ante el grupo',
      justificacion: 'Presentar resultados como si fuera ante un cliente refuerza la brecha de comunicación y habilidades blandas identificada por las empresas. La prueba de escritorio ya existe en la estructura didáctica; esta propuesta le da contexto profesional.',
      fuentes: ['Testeo empresarial', 'FTCOCU-236'],
    },
  ],
  intro: [
    {
      semana: '3–4',
      tema: 'Prototipado rápido con IA generativa (v0, Bolt)',
      justificacion: 'El panel de pertinencia debate si HTML/CSS debe tener la profundidad actual dado que las IAs ya generan estructura básica. Usar herramientas de generación asistida libera horas para UX sin eliminar el aprendizaje fundamental.',
      fuentes: ['Pertinencia'],
    },
    {
      semana: '9–10',
      tema: 'UX como diferenciador: entrevista de usuario antes de maquetar',
      justificacion: 'Los expertos recomiendan que el valor esté en comprender al usuario, no en memorizar propiedades CSS. Incluir una entrevista de usuario simulada antes de cada diseño orienta la materia hacia la consultoría.',
      fuentes: ['Pertinencia', 'Testeo empresarial'],
    },
    {
      semana: '13–14',
      tema: 'Landing page funcional con brief de emprendimiento real en 2 horas',
      justificacion: 'El testeo empresarial valora la capacidad de traducir necesidades en prototipos tangibles. Un ejercicio evaluable con restricción de tiempo forma la velocidad y la precisión bajo presión.',
      fuentes: ['Testeo empresarial'],
    },
    {
      semana: '16',
      tema: 'Lectura guiada de documentación oficial en inglés (MDN, W3C)',
      justificacion: 'El informe de pertinencia recomienda incluir inglés técnico como competencia transversal. Una sesión de lectura de MDN refuerza la autonomía sin exceder el nivel técnico laboral.',
      fuentes: ['Pertinencia'],
    },
  ],
  bd: [
    {
      semana: '6–7',
      tema: 'Diagnóstico de datos para negocio real de Medellín',
      justificacion: 'El testeo empresarial identifica el manejo de datos como diferenciador (4 valorado, 1 diferenciador). Simular una asesoría donde el estudiante entrevista al dueño de un negocio y diseña el modelo E-R conecta la materia con la consultoría.',
      fuentes: ['Testeo empresarial'],
    },
    {
      semana: '12–13',
      tema: 'Analítica con Power BI sobre datos generados por el estudiante',
      justificacion: 'El testeo demanda analítica y Power BI explícitamente. Los estudiantes exportan datos de sus consultas SQL y construyen un dashboard con conclusiones ejecutivas, formando la competencia de datos para decisiones.',
      fuentes: ['Testeo empresarial', 'Pertinencia'],
    },
    {
      semana: '15',
      tema: 'Introducción a gobernanza de datos e integridad referencial',
      justificacion: 'Las empresas demandan gobierno de datos como competencia. Una sesión sobre integridad referencial, respaldo y políticas de acceso es adecuada al nivel técnico y conecta con la seguridad de la información.',
      fuentes: ['Testeo empresarial'],
    },
    {
      semana: '17',
      tema: 'Presentación ejecutiva de hallazgos como consultoría de datos',
      justificacion: 'El estudiante presenta conclusiones del dashboard ante el grupo como si fuera un comité directivo. Conecta con la brecha de comunicación del testeo y forma al Intérprete del perfil Consultor Tech.',
      fuentes: ['Testeo empresarial', 'MNC'],
    },
  ],
  agiles: [
    {
      semana: '3–4',
      tema: 'Práctica guiada con Jira o Trello: tablero de proyecto real',
      justificacion: 'El informe de pertinencia recomienda migrar de Scrum teórico a agilismo real con herramientas de industria. Crear un tablero de proyecto como ejercicio evaluable cierra la brecha metodológica.',
      fuentes: ['Pertinencia'],
    },
    {
      semana: '8',
      tema: 'Simulación de levantamiento de requisitos con stakeholder real',
      justificacion: 'El testeo empresarial demanda comprensión del negocio y comunicación con clientes. Entrevistar a un docente o coordinador como si fuera un cliente alinea con la NCL 220501131.',
      fuentes: ['Testeo empresarial', 'NCL 220501131'],
    },
    {
      semana: '11–12',
      tema: 'Adoptar GitFlow como flujo de trabajo estándar en proyectos',
      justificacion: 'Los expertos recomiendan migrar de Git básico a flujo empresarial. Implementar ramas feature, develop y main en los proyectos del semestre reproduce el entorno corporativo.',
      fuentes: ['Pertinencia'],
    },
    {
      semana: '15–16',
      tema: 'Taller de comunicación asertiva y manejo de la frustración',
      justificacion: 'El testeo identifica habilidades blandas como brecha alta, y el eje Humano del informe de pertinencia demanda comunicación asertiva y adaptabilidad. Un taller vivencial con roles y retroalimentación grupal.',
      fuentes: ['Testeo empresarial', 'Pertinencia'],
    },
  ],
  backend1: [
    {
      semana: '4–5',
      tema: 'Programación en pares con GitHub Copilot como copiloto de IA',
      justificacion: 'El informe de pertinencia recomienda que el estudiante aprenda a programar «en pares» con copilotos de IA, auditando el código generado en lugar de solo escribirlo manualmente.',
      fuentes: ['Pertinencia'],
    },
    {
      semana: '8–9',
      tema: 'Principios SOLID y Clean Code sobre memorización de API Java',
      justificacion: 'Los expertos señalan que la arquitectura y la limpieza del código son más valiosos que la sintaxis. Refactorizar código existente con checklist de calidad forma el saber-hacer del MNC.',
      fuentes: ['Pertinencia', 'MNC'],
    },
    {
      semana: '13–14',
      tema: 'CRUD progresivo integrado con base de datos y caso empresarial',
      justificacion: 'El testeo demanda integración con BD y criterio técnico. Conectar el backend con SQL Server para un sistema empresarial completo (citas médicas, inventario) como proyecto continuo del semestre.',
      fuentes: ['Testeo empresarial'],
    },
    {
      semana: '16–17',
      tema: 'Code review cruzado con checklist de calidad profesional',
      justificacion: 'Otro equipo revisa el código con criterios de responsabilidad única, encapsulamiento y solución al problema del cliente. Forma el criterio técnico y la cultura de calidad.',
      fuentes: ['Testeo empresarial', 'Pertinencia'],
    },
  ],
  frontend1: [
    {
      semana: '5–6',
      tema: 'Lectura guiada de documentación en inglés (MDN, React docs)',
      justificacion: 'El informe de pertinencia recomienda incluir lectura de documentación en inglés como competencia transversal. Una sesión guiada con ejercicios de comprensión es adecuada al nivel técnico laboral.',
      fuentes: ['Pertinencia'],
    },
    {
      semana: '9–10',
      tema: 'Consumo de API real con contexto de negocio (datos de Medellín)',
      justificacion: 'El testeo demanda consumo de APIs e interfaces funcionales. Conectar el frontend a una API pública y presentar datos de forma útil para un usuario no técnico conecta la competencia con la empleabilidad.',
      fuentes: ['Testeo empresarial', 'Pertinencia'],
    },
    {
      semana: '13–14',
      tema: 'Depuración como resolución de problemas: diagnóstico de errores',
      justificacion: 'El testeo identifica el pensamiento orientado a solución como brecha alta. Entregar código JavaScript con errores intencionales para diagnóstico y corrección simula un escenario de consultoría ante un sistema con fallos.',
      fuentes: ['Testeo empresarial'],
    },
    {
      semana: '17',
      tema: 'Demo en vivo: presentar solución técnica a audiencia no técnica',
      justificacion: 'Las empresas demandan comunicación clara. El estudiante demuestra la funcionalidad al grupo explicando qué problema resuelve, cómo lo resuelve y qué decisiones técnicas tomó.',
      fuentes: ['Testeo empresarial'],
    },
  ],
  nuevastec: [
    {
      semana: '3–4',
      tema: 'Prompting avanzado para acelerar desarrollo de código',
      justificacion: 'El informe de pertinencia recomienda enseñar prompting como competencia profesional. Crear prompts efectivos para generar, refactorizar y documentar código forma la habilidad que el sector ya exige.',
      fuentes: ['Pertinencia'],
    },
    {
      semana: '7–8',
      tema: 'Vibe Coding: programación asistida por IA con validación crítica',
      justificacion: 'Los expertos señalan que el sector ya usa IA como herramienta diaria. Practicar «programación en pares» con IA evaluando críticamente cada resultado forma al Socio Tecnológico del perfil Consultor Tech.',
      fuentes: ['Pertinencia'],
    },
    {
      semana: '11–12',
      tema: 'Analítica de datos con Python/Pandas aplicada a decisiones empresariales',
      justificacion: 'El testeo sugiere especializar en datos. Generar un reporte ejecutivo con hallazgos y recomendaciones a partir de un dataset real conecta la materia con la empleabilidad directa.',
      fuentes: ['Testeo empresarial', 'Pertinencia'],
    },
    {
      semana: '15–16',
      tema: 'Debate ético sobre IA: cuándo confiar, cómo validar, qué riesgos',
      justificacion: 'Tanto el testeo como la pertinencia destacan el uso estratégico de IA como brecha alta. Panel grupal con posturas opuestas y contraargumentos obligatorios forma el pensamiento crítico del nivel técnico.',
      fuentes: ['Testeo empresarial', 'Pertinencia'],
    },
  ],
  backend2: [
    {
      semana: '5–6',
      tema: 'Fundamentos de Cloud: conceptos de Azure o AWS adaptados al nivel técnico',
      justificacion: 'El informe de pertinencia recomienda integrar Cloud Fundamentals (Azure AZ-900, AWS Cloud Practitioner). Una introducción conceptual a servicios cloud con ejercicio práctico guiado.',
      fuentes: ['Pertinencia'],
    },
    {
      semana: '10–11',
      tema: 'Pipeline CI/CD con GitHub Actions integrado al flujo de desarrollo',
      justificacion: 'El testeo demanda DevSecOps y la pertinencia recomienda CI/CD. Configurar un pipeline básico que compile, pruebe y despliegue automáticamente cierra la brecha entre desarrollo y operaciones.',
      fuentes: ['Pertinencia', 'Testeo empresarial'],
    },
    {
      semana: '14',
      tema: 'Concepto introductorio de Infraestructura como Código (Docker Compose)',
      justificacion: 'Los expertos sugieren IaC como concepto emergente para el habilitador tecnológico. Una sesión teórico-práctica con Docker Compose es adecuada al nivel técnico sin exceder el alcance del programa.',
      fuentes: ['Pertinencia'],
    },
    {
      semana: '16–17',
      tema: 'Revisión cruzada de seguridad en APIs REST',
      justificacion: 'El testeo demanda ciberseguridad básica. Otro equipo revisa la API buscando vulnerabilidades: validación de inputs, endpoints protegidos, manejo de errores. Informe de hallazgos por escrito.',
      fuentes: ['Testeo empresarial'],
    },
  ],
  frontend2: [
    {
      semana: '4–5',
      tema: 'CI/CD con GitHub Actions para despliegue automático',
      justificacion: 'El informe de pertinencia recomienda CI/CD en el flujo de despliegue. Configurar un pipeline que publique automáticamente al hacer merge forma la competencia de entrega continua.',
      fuentes: ['Pertinencia'],
    },
    {
      semana: '9–10',
      tema: 'Fundamentos de Cloud para hosting (Vercel, Netlify, Railway)',
      justificacion: 'El testeo demanda Cloud computing y la pertinencia recomienda fundamentos de nube. Desplegar un proyecto en un servicio cloud gratuito con dominio configurado cierra la brecha de empleabilidad.',
      fuentes: ['Pertinencia', 'Testeo empresarial'],
    },
    {
      semana: '13–14',
      tema: 'Inglés técnico: configurar plataformas siguiendo documentación oficial',
      justificacion: 'La pertinencia recomienda inglés técnico como competencia transversal. Configurar un servicio cloud siguiendo documentación en inglés como ejercicio evaluable refuerza la autonomía.',
      fuentes: ['Pertinencia'],
    },
    {
      semana: '16–17',
      tema: 'Checklist de seguridad y pruebas de rendimiento antes del deploy',
      justificacion: 'El testeo demanda seguridad web. Recorrer un checklist de HTTPS, headers de seguridad, validación de inputs, compresión de assets y pruebas de carga básicas antes de cada entrega.',
      fuentes: ['Testeo empresarial'],
    },
  ],
};
