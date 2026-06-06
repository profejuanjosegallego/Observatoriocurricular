import { getMateria } from './materias';

export const PROYECTOS_INTEGRADORES = {
  1: {
    titulo: 'El Consultor como Intérprete',
    modelo: 'Data-First',
    modeloDescripcion: 'Primero los Datos — el proyecto se construye desde la arquitectura de la información',
    objetivo: 'Crear un caso de estudio en tres capas desconectadas (Datos, Lógica, Visual) donde cada equipo desarrolla productos separados que responden al mismo problema empresarial, integrándolos conceptualmente a través del Modelo Relacional como contrato maestro.',
    concepto: 'Caso de Estudio en Tres Capas Desconectadas',
    conceptoDetalle: 'Cada equipo selecciona un tema (directorio de negocios, inventario, gestor de biblioteca) y desarrolla tres productos separados: la capa de datos (SQL), la capa lógica (Java en consola) y la capa visual (HTML/CSS). Las tres capas convergen a través del Modelo Relacional.',
    lider: 'bd',
    liderRol: 'PM Logístico',
    liderRazon: 'El Modelo Relacional es el contrato maestro y prerequisito conceptual: los wireframes y el pseudocódigo dependen de la definición de datos.',
    apoyo: [
      { materia: 'intro', rol: 'Diseñador de Vistas', descripcion: 'Consume el MR para visualizarlo. Si BD define tabla Producto, Intro crea producto.html.' },
      { materia: 'logica', rol: 'Ingeniero de Procesos', descripcion: 'Consume el MR para darle vida. Si BD define tabla Usuario, Lógica crea el proceso "Registrar Usuario".' },
    ],
    capas: [
      { nombre: 'Capa de Datos', color: '#3b82f6', icono: 'db', descripcion: 'Modelo Relacional → DDL → Procedimientos almacenados', materia: 'bd' },
      { nombre: 'Capa Visual', color: '#E6007E', icono: 'ui', descripcion: 'Wireframes → HTML semántico → Maqueta responsive', materia: 'intro' },
      { nombre: 'Capa Lógica', color: '#f59e0b', icono: 'code', descripcion: 'Pseudocódigo → Java con variables → Programa funcional', materia: 'logica' },
    ],
    integracion: 'El Modelo Relacional es el contrato que conecta las tres capas. La evaluación final incluye un documento conceptual donde los estudiantes explican cómo se conectarían las capas.',
    avances: [
      {
        semana: 6, nombre: 'El Contrato, el Diseño y los Flujos',
        porMateria: {
          bd: { titulo: 'Modelo E-R y Modelo Relacional', detalle: 'El equipo define su caso de estudio y lo traduce en un diagrama de tablas, columnas y relaciones. Entrega el Modelo Entidad-Relación (MER) y el Modelo Relacional (MR) normalizado como "contrato maestro" del proyecto.' },
          intro: { titulo: 'Wireframes + HTML semántico puro', detalle: 'Crear wireframes (dibujos a mano o herramienta simple) de las vistas principales. Traducir el Modelo Relacional a HTML puro: si BD define tabla Producto, se crea producto.html con estructura semántica (header, main, section, article). Mínimo 2 archivos .html, sin CSS.' },
          logica: { titulo: 'Pseudocódigo secuencial en Pseint/LPP', detalle: 'Traducir un proceso simple del MR (ej. registrar un Usuario) a pseudocódigo o diagrama de flujo estrictamente secuencial en Pseint o LPP. Sin condicionales ni ciclos: solo lectura de datos, asignación y escritura.' },
        },
      },
      {
        semana: 12, nombre: 'La Estructura y el Estilo',
        porMateria: {
          bd: { titulo: 'Script SQL (DDL + DML básico)', detalle: 'Entregar un archivo .sql con los CREATE TABLE que implementan el MR del Avance 1, incluyendo claves primarias, foráneas e integridad referencial. Agregar 3–5 sentencias INSERT por tabla con datos de prueba coherentes.' },
          intro: { titulo: 'Maqueta HTML con CSS puro', detalle: 'Tomar los archivos .html del Avance 1 y crear un style.css externo. Aplicar selectores, modelo de caja, posicionamiento y Flexbox basándose en los wireframes del Avance 1. Sin frameworks, solo CSS nativo.' },
          logica: { titulo: 'Archivo Java de sintaxis y variables', detalle: 'Crear un archivo .java donde se declaren variables que representen los datos del MR (ej. String nombreProducto; int precio;). Demostrar el uso de operadores (ej. double iva = precio * 0.19;) e imprimir resultados en consola. No es un programa funcional: es un ejercicio de sintaxis aplicada.' },
        },
      },
      {
        semana: 17, nombre: 'Producto Final Simulado',
        porMateria: {
          bd: { titulo: 'Script SQL completo + Stored Procedures', detalle: 'Script .sql completo (DDL + DML poblado) más procedimientos almacenados con parámetros para operaciones específicas. Consultas con JOINs y funciones agregadas (COUNT, SUM, AVG) sobre las tablas del caso de estudio.' },
          intro: { titulo: 'Maqueta final responsive + framework CSS', detalle: 'Tomar la maqueta del Avance 2 y aplicar Bootstrap o Tailwind para que sea completamente responsiva. Agregar pseudoclases, transiciones CSS y al menos un formulario funcional visualmente.' },
          logica: { titulo: 'Programa Java funcional con arreglos', detalle: 'Programa de consola completo que use arreglos para simular la BD en memoria. Crear un menú con switch y while que permita Listar, Buscar, Agregar y Eliminar registros. Funciones reutilizables para cada operación.' },
          _transversal: { titulo: 'Documento conceptual de integración', detalle: 'Documento donde el equipo explica cómo se conectarían las 3 capas en un producto real. Cada docente lo califica desde su lente: BD evalúa si el modelo soporta el proyecto, Intro evalúa la conexión UI → lógica, Lógica evalúa cómo los datos alimentan los procesos. Peso: 20–30% de la nota final de cada módulo.' },
        },
      },
    ],
  },
  2: {
    titulo: 'El Arquitecto de Soluciones',
    modelo: 'Agile-First',
    modeloDescripcion: 'Primero el Proceso — la metodología Scrum dirige el esfuerzo de los dos equipos de desarrollo',
    objetivo: 'Construir una aplicación web bajo metodología Scrum donde los equipos de backend y frontend trabajan en paralelo como Dev Teams desacoplados, gestionados por el equipo de Metodologías Ágiles como PMO.',
    concepto: 'Un Proyecto, Dos Equipos, Un Proceso',
    conceptoDetalle: 'El equipo de Gestión (Ágiles) actúa como Scrum Master y Product Owner. Los equipos de Backend y Frontend operan como Dev Teams que trabajan en paralelo. El desacoplamiento es pedagógico: simula escenarios reales donde UI avanza con datos simulados sin esperar al backend.',
    lider: 'agiles',
    liderRol: 'PMO / Agile Coach',
    liderRazon: 'El proyecto ES la metodología. Ágiles no es un módulo de apoyo, es la oficina de gestión que dirige el esfuerzo completo a través de Scrum.',
    apoyo: [
      { materia: 'backend1', rol: 'Dev Team: Lógica & Datos', descripcion: 'Implementa la lógica de negocio en POO. Si Ágiles define "Como usuario quiero registrarme", Backend crea la clase Usuario.' },
      { materia: 'frontend1', rol: 'Dev Team: UI & Experience', descripcion: 'Construye la interfaz con DOM y JS asíncrono. Consume el backlog de Ágiles para implementar las vistas.' },
    ],
    capas: [
      { nombre: 'Gestión Ágil', color: '#10b981', icono: 'scrum', descripcion: 'Product Backlog → Sprints → Burndown → Retrospectiva', materia: 'agiles' },
      { nombre: 'Backend POO', color: '#3b82f6', icono: 'code', descripcion: 'Clases Java → Herencia/Polimorfismo → JPA+Hibernate', materia: 'backend1' },
      { nombre: 'Frontend JS', color: '#E6007E', icono: 'ui', descripcion: 'DOM → Eventos → Fetch → App web funcional', materia: 'frontend1' },
    ],
    integracion: 'La metodología Scrum es la integración. La nota de Ágiles es la nota de integración (20–30% en cada módulo técnico). Los estudiantes técnicos deben respetar el proceso ágil.',
    avances: [
      {
        semana: 6, nombre: 'Sprint 0 Review',
        porMateria: {
          agiles: { titulo: 'Acta de constitución + Roles Scrum + Vision Board', detalle: 'Redactar el acta de constitución del proyecto con el objetivo, alcance y restricciones. Asignar roles Scrum (Product Owner, Scrum Master, Dev Team). Crear el Vision Board del producto: ¿para quién? ¿qué problema resuelve? ¿cómo se diferencia?' },
          backend1: { titulo: 'Diagrama de clases UML + primeras clases Java', detalle: 'Diseñar el diagrama de clases UML con atributos, métodos y relaciones. Implementar las clases principales en Java con constructores, getters/setters y encapsulamiento. Usar ArrayList para almacenar objetos en memoria.' },
          frontend1: { titulo: 'Mockups de interfaz + estructura HTML/JS base', detalle: 'Crear mockups de las vistas principales del producto. Implementar la estructura base en HTML con JavaScript: variables, condicionales, ciclos y funciones que modelen la lógica de navegación del usuario.' },
        },
      },
      {
        semana: 12, nombre: 'Sprint 1 Review',
        porMateria: {
          agiles: { titulo: 'Product Backlog priorizado + tablero Kanban', detalle: 'Product Backlog completo con épicas desglosadas en historias de usuario con criterios de aceptación. Tablero Kanban en Jira/Trello con las historias del Sprint 1 movidas a Done. Registro de la Sprint Planning y al menos 2 Daily Standups documentados.' },
          backend1: { titulo: 'Java con herencia, polimorfismo e interfaces', detalle: 'Implementar herencia (super, extends) y polimorfismo en las clases del proyecto. Crear al menos una clase abstracta y una interfaz como contrato entre componentes. Demostrar el principio abierto/cerrado con extensiones del modelo.' },
          frontend1: { titulo: 'App web con CRUD DOM + eventos', detalle: 'Aplicación web funcional que manipule el DOM: crear, listar, editar y eliminar elementos dinámicamente con JavaScript. Manejo de eventos (click, submit, input) y uso de arreglos/objetos JS para modelar los datos del backlog.' },
        },
      },
      {
        semana: 17, nombre: 'Sprint 2 Review',
        porMateria: {
          agiles: { titulo: 'Burndown chart + retrospectiva final + documentación', detalle: 'Burndown chart del Sprint 2 comparando trabajo planificado vs. completado. Retrospectiva documentada: ¿qué salió bien? ¿qué mejorar? ¿qué dejar de hacer? Documentación completa del proyecto: flujo acumulado, velocity del equipo y lecciones aprendidas.' },
          backend1: { titulo: 'App Java con JPA + Hibernate + CRUD persistido', detalle: 'Aplicación de consola conectada a base de datos vía JPA+Hibernate. Entidades mapeadas con anotaciones (@Entity, @Id, @GeneratedValue). Repositorio con operaciones CRUD completas (persist, find, merge, remove). Consultas JPQL para búsquedas específicas.' },
          frontend1: { titulo: 'App web con fetch + async/await + localStorage', detalle: 'Aplicación web que consuma datos con fetch usando promesas y async/await. Persistencia local con localStorage para mantener estado entre sesiones. Event loop, callbacks y manejo de errores asíncronos demostrados en el flujo del producto.' },
        },
      },
    ],
  },
  3: {
    titulo: 'El Socio Tecnológico',
    modelo: 'API-First',
    modeloDescripcion: 'Primero la API — la API REST es la fuente única de verdad que consume toda la plataforma',
    objetivo: 'Construir y consumir una API REST profesional donde Backend 2 provee los datos, Frontend 2 construye la SPA y Nuevas Tecnologías realiza analítica y soporte DevOps, logrando la integración Full-Stack total.',
    concepto: 'La API como Fuente Única de Verdad',
    conceptoDetalle: 'Backend 2 construye la API REST documentada con Swagger. Frontend 2 construye una SPA con React que consume esa API. Nuevas Tecnologías consume la API para análisis con Python y brinda soporte con Git/GitFlow.',
    lider: 'backend2',
    liderRol: 'Arquitecto de Producto',
    liderRazon: 'El proyecto no avanza sin la API. El contrato API (colección Postman) es el insumo técnico principal para los otros dos módulos.',
    apoyo: [
      { materia: 'frontend2', rol: 'Consumidor UI (SPA)', descripcion: 'Construye una Single-Page Application con React que consume la API del Backend para mostrar y manipular datos.' },
      { materia: 'nuevastec', rol: 'Consumidor de Datos & DevOps', descripcion: 'Consume la API para análisis con Pandas/Matplotlib y brinda soporte transversal con Git/GitFlow.' },
    ],
    capas: [
      { nombre: 'API REST', color: '#3b82f6', icono: 'api', descripcion: 'Spring Boot → JPA → Swagger → JUnit', materia: 'backend2' },
      { nombre: 'SPA React', color: '#E6007E', icono: 'ui', descripcion: 'Componentes → React Router → Consumo API', materia: 'frontend2' },
      { nombre: 'Analítica Python', color: '#10b981', icono: 'data', descripcion: 'Pandas → Matplotlib → Reportes → GitFlow', materia: 'nuevastec' },
    ],
    integracion: 'La integración es técnica y total: el frontend consume la API real del backend, y Python genera reportes analíticos desde la misma fuente de datos. GitFlow gestiona el código de los tres equipos.',
    avances: [
      {
        semana: 6, nombre: 'Arquitectura Base',
        porMateria: {
          backend2: { titulo: 'Spring Boot inicializado + entidades JPA', detalle: 'Proyecto Spring Boot configurado con Maven y estructura por capas. Entidades JPA mapeadas con relaciones (@OneToMany, @ManyToOne, @JoinColumn). Configuración de conexión a base de datos y properties del proyecto.' },
          frontend2: { titulo: 'Proyecto React configurado + componentes base', detalle: 'Proyecto React inicializado con la estructura de carpetas (components, pages, services). Componentes funcionales base con useState para los formularios principales. Árbol de contenido y bocetos de la interfaz según el diseño del producto.' },
          nuevastec: { titulo: 'Repositorio GitFlow + scripts Python base', detalle: 'Repositorio Git inicializado con ramas main, develop y convención de feature branches. Entorno virtual Python configurado con las dependencias (pandas, matplotlib, requests). Script base que conecta con la fuente de datos y valida la estructura.' },
        },
      },
      {
        semana: 12, nombre: 'Contrato API',
        porMateria: {
          backend2: { titulo: 'API REST funcional + colección Postman', detalle: 'Repositorios JPA con consultas derivadas y personalizadas (JPQL). Capa de servicios con lógica de negocio e inyección de dependencias (@Autowired, @Service). DTOs con MapStruct para separar entidad de respuesta. Controladores REST con @GetMapping, @PostMapping, @PutMapping, @DeleteMapping. Colección Postman con todos los endpoints documentados y probados.' },
          frontend2: { titulo: 'React con CRUD funcional + almacenamiento', detalle: 'Componentes React con useState y useEffect para gestionar datos dinámicos. Formularios controlados para crear y editar registros. Almacenamiento temporal con localStorage o estado global. Evaluación de usabilidad: la interfaz es intuitiva y funcional sin manual.' },
          nuevastec: { titulo: 'Script Pandas de limpieza y análisis', detalle: 'Lectura de datos desde la API o archivos CSV con Pandas. Limpieza: manejo de valores nulos, tipos de datos, duplicados. Análisis exploratorio: agrupaciones (groupby), filtros, estadísticas descriptivas. Calidad de datos documentada: qué se encontró y qué se corrigió.' },
        },
      },
      {
        semana: 17, nombre: 'Producto Full-Stack',
        porMateria: {
          backend2: { titulo: 'API completa + Swagger + JUnit', detalle: 'API REST completa con todos los endpoints del dominio. Documentación Swagger/OpenAPI accesible desde /swagger-ui.html. DTOs con validación (@NotNull, @Size, @Email). Pruebas unitarias con JUnit para los servicios críticos (@Test, @MockBean). Manejo de errores con @ExceptionHandler y respuestas HTTP apropiadas.' },
          frontend2: { titulo: 'SPA React + Router + consumo API real', detalle: 'Single-Page Application con React Router para navegación entre vistas. Consumo de la API real del Backend con fetch o axios (no datos simulados). Diseño responsivo que funciona en escritorio y móvil. Manejo de estados de carga, error y vacío. Hosting configurado y funcionando (Vercel, Netlify o servidor institucional).' },
          nuevastec: { titulo: 'Reporte analítico con gráficos + GitFlow completo', detalle: 'Visualizaciones con Matplotlib y Seaborn: gráficos de barras, líneas, distribuciones, subplots con anotaciones. Reporte HTML con hallazgos, tendencias y recomendaciones para el cliente basadas en los datos. Consumo de la API real para generar los reportes. Flujo GitFlow completo: feature branches mergeados a develop vía pull request, release branch preparada.' },
        },
      },
    ],
  },
};

export const BOOTCAMPS = [
  {
    nivel: 1,
    nombre: 'Bootcamp: El Intérprete en Acción',
    duracion: '1 día (jornada completa)',
    cuando: 'Al finalizar el Nivel I (posterior a la semana 17)',
    objetivo: 'Condensar en un solo día todo lo aprendido en el nivel: el estudiante recibe un reto empresarial real y debe descomponerlo en las tres capas (datos, interfaz, lógica), demostrando que interpreta necesidades y las traduce en artefactos técnicos.',
    reto: 'Una empresa local presenta un problema real (ej. "necesito organizar mi inventario"). Los equipos deben entregar en el día: el modelo de datos (E-R), la maqueta de interfaz (HTML/CSS) y el flujo lógico (pseudocódigo/Java), integrándolos conceptualmente.',
    agenda: [
      {
        hora: '8:00 – 8:30', actividad: 'Presentación del reto por la empresa invitada',
        tematicas: ['Comprensión del contexto empresarial y el problema de negocio', 'Identificación de entidades, actores y procesos clave del reto', 'Preguntas al cliente: elicitación de requisitos informales'],
      },
      {
        hora: '8:30 – 9:00', actividad: 'Conformación de equipos y análisis del problema',
        tematicas: ['Distribución de roles por capa: datos, interfaz y lógica', 'Levantamiento rápido de entidades y relaciones del dominio', 'Boceto inicial del Modelo E-R en papel o pizarra'],
      },
      {
        hora: '9:00 – 12:00', actividad: 'Desarrollo: cada integrante trabaja en su capa',
        tematicas: [
          'BD: diseño del Modelo Relacional normalizado (1FN–3FN), creación del DDL con CREATE TABLE, integridad referencial (PKs, FKs), inserción de datos de prueba con INSERT',
          'Interfaz: maquetación HTML5 semántico (header, main, section, article), estilización con CSS3 (Flexbox, modelo de caja), formularios y tablas que representen las entidades del MR',
          'Lógica: traducción de procesos del negocio a pseudocódigo secuencial, implementación en Java con variables, operadores, condicionales y ciclos, simulación de operaciones CRUD con arreglos en memoria',
        ],
      },
      {
        hora: '12:00 – 13:00', actividad: 'Almuerzo e integración conceptual del equipo',
        tematicas: ['Revisión cruzada: cada rol explica cómo su capa responde al MR', 'Identificación de inconsistencias entre las tres capas', 'Redacción del documento conceptual de integración'],
      },
      {
        hora: '13:00 – 15:00', actividad: 'Refinamiento y preparación de la sustentación',
        tematicas: [
          'BD: procedimientos almacenados con parámetros para consultas específicas, consultas con JOINs y funciones agregadas (COUNT, SUM, AVG)',
          'Interfaz: diseño responsive con media queries o framework CSS (Bootstrap/Tailwind), pseudoclases y transiciones CSS para interactividad visual',
          'Lógica: funciones Java reutilizables para los procesos del negocio, menú de consola con switch/while para la navegación del usuario',
          'Integración: cómo el MR alimenta la interfaz y la lógica, preparación de la narrativa de sustentación',
        ],
      },
      {
        hora: '15:00 – 16:30', actividad: 'Sustentación ante la empresa y panel de docentes',
        tematicas: ['Presentación de la solución completa: problema → datos → interfaz → lógica', 'Demostración técnica de cada capa funcionando', 'Explicación del documento conceptual: cómo se conectarían las capas en un producto real'],
      },
      {
        hora: '16:30 – 17:00', actividad: 'Retroalimentación de la empresa y cierre',
        tematicas: ['Evaluación del cliente: ¿la solución responde a su necesidad?', 'Reflexión sobre el perfil del Consultor como Intérprete', 'Lecciones aprendidas: qué funcionó y qué mejorar en la traducción problema → solución'],
      },
    ],
    competencias: [
      'Interpretar necesidades de un contexto empresarial real',
      'Modelar datos a partir de un problema no estructurado',
      'Traducir un modelo de datos en interfaz y lógica',
      'Trabajar en equipo bajo presión de tiempo',
      'Sustentar una solución técnica ante un cliente',
    ],
    materias: ['bd', 'intro', 'logica'],
    color: '#6366f1',
  },
  {
    nivel: 2,
    nombre: 'Bootcamp: Arquitectura bajo Presión',
    duracion: '1 día (jornada completa)',
    cuando: 'Al finalizar el Nivel II (posterior a la semana 17)',
    objetivo: 'Simular un sprint intensivo donde los equipos reciben un requerimiento empresarial, lo descomponen en historias de usuario, diseñan la solución con POO y construyen la interfaz interactiva, todo bajo la gestión ágil del proceso.',
    reto: 'Una organización presenta un problema de gestión (ej. "necesito un sistema de reservas"). Los equipos operan como una célula ágil: Scrum Master gestiona el backlog, Backend diseña las clases, Frontend construye la interfaz. Al final del día se realiza un Sprint Review real.',
    agenda: [
      {
        hora: '8:00 – 8:30', actividad: 'Briefing del reto empresarial y definición de roles Scrum',
        tematicas: ['Comprensión del requerimiento de negocio y alcance del producto', 'Asignación de roles Scrum: Product Owner, Scrum Master, Dev Team (Back y Front)', 'Acta de constitución del proyecto y definición del Vision Board'],
      },
      {
        hora: '8:30 – 9:30', actividad: 'Sprint Planning: historias de usuario y priorización del backlog',
        tematicas: ['Redacción de historias de usuario con formato "Como… quiero… para…"', 'Descomposición de épicas en tareas accionables en Jira/Trello', 'Priorización del Product Backlog: valor de negocio vs. complejidad técnica', 'Estimación de esfuerzo y selección de historias para el sprint del día'],
      },
      {
        hora: '9:30 – 12:00', actividad: 'Sprint de desarrollo: Backend y Frontend en paralelo',
        tematicas: [
          'Backend: modelado de clases con herencia y polimorfismo (ej. clase Reserva extiende de Transacción), encapsulamiento con getters/setters y constructores, uso de ArrayList y colecciones para gestionar datos en memoria, interfaces Java como contratos entre componentes',
          'Frontend: manipulación del DOM con selectores (getElementById, querySelector), creación dinámica de elementos HTML desde JavaScript, manejo de eventos (click, submit, input) para interactividad, uso de objetos y arreglos JS para modelar datos del backlog',
          'Ágiles: seguimiento del tablero Kanban (To Do → In Progress → Done), facilitación de comunicación entre Back y Front sin dependencia directa',
        ],
      },
      {
        hora: '12:00 – 13:00', actividad: 'Almuerzo y Daily Standup',
        tematicas: ['Cada rol responde: ¿qué hice? ¿qué haré? ¿qué me bloquea?', 'Ajuste del backlog según avance real vs. estimación', 'Decisiones de alcance: qué historias se completan y cuáles se recortan'],
      },
      {
        hora: '13:00 – 15:00', actividad: 'Sprint de integración: conectar la interfaz con la lógica',
        tematicas: [
          'Consumo de datos con fetch y async/await: el frontend llama endpoints simulados o localStorage',
          'Promesas y manejo de respuestas asíncronas para renderizar datos dinámicos',
          'Backend: conexión con datos persistidos vía JPA/Hibernate (o simulación con archivos JSON)',
          'CRUD completo desde la interfaz: crear, listar, buscar y eliminar registros',
          'Ágiles: validación de criterios de aceptación de cada historia de usuario',
        ],
      },
      {
        hora: '15:00 – 16:00', actividad: 'Sprint Review: demostración del producto al cliente',
        tematicas: ['Presentación funcional del producto: flujo completo desde la interfaz', 'Demostración de las historias de usuario completadas vs. backlog', 'Burndown chart del día: trabajo planificado vs. completado'],
      },
      {
        hora: '16:00 – 17:00', actividad: 'Retrospectiva y retroalimentación de la empresa',
        tematicas: ['Retrospectiva Scrum: ¿qué salió bien? ¿qué mejorar? ¿qué dejar de hacer?', 'Evaluación del cliente: ¿el producto resuelve su necesidad?', 'Reflexión sobre el perfil del Arquitecto de Soluciones: diseñar y construir bajo proceso'],
      },
    ],
    competencias: [
      'Diseñar soluciones técnicas bajo metodología ágil',
      'Descomponer requerimientos en historias de usuario accionables',
      'Implementar POO aplicada a un problema real',
      'Construir interfaces interactivas con JavaScript y DOM',
      'Demostrar un producto funcional ante un cliente',
    ],
    materias: ['agiles', 'backend1', 'frontend1'],
    color: '#E6007E',
  },
  {
    nivel: 3,
    nombre: 'Bootcamp: Integración Full-Stack',
    duracion: '1 día (jornada completa)',
    cuando: 'Al finalizar el Nivel III (posterior a la semana 17)',
    objetivo: 'Demostrar la capacidad de integración Full-Stack total: el equipo recibe un reto de negocio, construye la API, la consume desde React, genera analítica con Python y despliega la solución, actuando como socios tecnológicos del cliente.',
    reto: 'Una empresa presenta una necesidad de datos y visualización (ej. "necesito ver mis métricas de ventas en tiempo real"). Los equipos construyen la API con Spring Boot, la SPA con React y el reporte analítico con Python, integrando las tres capas en un producto funcional.',
    agenda: [
      {
        hora: '8:00 – 8:30', actividad: 'Presentación del reto y definición del contrato API',
        tematicas: ['Comprensión del problema de negocio y los datos involucrados', 'Definición del contrato API: endpoints, verbos HTTP, estructura de respuestas JSON', 'Acuerdo entre equipos: qué datos expone la API, qué consume React, qué analiza Python'],
      },
      {
        hora: '8:30 – 9:30', actividad: 'Diseño de la arquitectura Full-Stack',
        tematicas: ['Modelado de entidades JPA con relaciones (@OneToMany, @ManyToOne)', 'Diagrama de componentes React: páginas, componentes reutilizables, rutas', 'Definición del pipeline de datos Python: fuente → limpieza → análisis → visualización', 'Creación del repositorio GitFlow con ramas main, develop y feature por equipo'],
      },
      {
        hora: '9:30 – 12:00', actividad: 'Desarrollo en paralelo: API, SPA y Analítica',
        tematicas: [
          'API: configuración Spring Boot con Maven, entidades JPA mapeadas a tablas, repositorios con consultas derivadas y personalizadas (JPQL), capa de servicios con lógica de negocio e inyección de dependencias, controladores REST con @GetMapping/@PostMapping y manejo de errores',
          'SPA: creación de componentes React funcionales con useState y useEffect, React Router para navegación entre vistas, consumo de la API con fetch/axios y renderizado de datos dinámicos, formularios controlados para crear y editar registros',
          'Analítica: lectura de datos desde la API con requests/urllib, limpieza y transformación con Pandas (DataFrames, filtros, agrupaciones), visualización con Matplotlib y Seaborn (barras, líneas, distribuciones)',
        ],
      },
      {
        hora: '12:00 – 13:00', actividad: 'Almuerzo e integración: conectar las tres capas',
        tematicas: ['Prueba de integración: React consume la API real, no datos simulados', 'Python genera reporte desde los mismos endpoints que usa React', 'Resolución de conflictos de CORS, formato de datos y rutas'],
      },
      {
        hora: '13:00 – 15:00', actividad: 'Refinamiento: pruebas, documentación y gráficos',
        tematicas: [
          'API: documentación Swagger/OpenAPI de todos los endpoints, DTOs con validación (@NotNull, @Size) para separar entidad de respuesta, pruebas unitarias con JUnit para los servicios críticos',
          'SPA: diseño responsivo, manejo de estados de carga y error, ajustes de UX y accesibilidad',
          'Analítica: gráficos avanzados con Matplotlib (subplots, anotaciones), generación de reporte HTML con hallazgos y recomendaciones para el cliente',
          'DevOps: merge de ramas feature a develop vía pull request, verificación del flujo GitFlow completo',
        ],
      },
      {
        hora: '15:00 – 16:30', actividad: 'Demo Day: presentación Full-Stack al cliente',
        tematicas: ['Demostración en vivo: flujo completo API → React → Reporte Python', 'Presentación de la documentación Swagger como contrato técnico', 'Hallazgos analíticos: qué revelan los datos y qué recomienda el equipo al cliente'],
      },
      {
        hora: '16:30 – 17:00', actividad: 'Retroalimentación, certificación y cierre del programa',
        tematicas: ['Evaluación del cliente: ¿la solución integra datos, interfaz y analítica?', 'Reflexión sobre el perfil del Socio Tecnológico: integrar ecosistemas y asesorar con fundamento', 'Certificación del bootcamp y cierre del ciclo formativo del programa'],
      },
    ],
    competencias: [
      'Diseñar y construir una API REST profesional con Spring Boot',
      'Consumir una API desde una SPA con React',
      'Generar analítica de datos con Python (Pandas + Matplotlib)',
      'Integrar un ecosistema Full-Stack completo con GitFlow',
      'Presentar una solución profesional a un cliente real',
    ],
    materias: ['backend2', 'frontend2', 'nuevastec'],
    color: '#10b981',
  },
];

export function getPI(nivel) {
  return PROYECTOS_INTEGRADORES[nivel] || null;
}

export function getBootcamp(nivel) {
  return BOOTCAMPS.find(b => b.nivel === nivel) || null;
}
