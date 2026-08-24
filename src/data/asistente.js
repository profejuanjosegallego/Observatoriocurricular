// Base de conocimiento del asistente del Observatorio Curricular.
//
// El emparejamiento se hace primero aquí, en el navegador: si la pregunta del docente
// coincide con una entrada, se responde al instante, sin consumir cupo de IA.
// Solo lo que no coincide viaja a la IA, y viaja con estas mismas entradas como contexto,
// de modo que la respuesta quede anclada a lo que la plataforma realmente hace.
//
// Para añadir una pregunta nueva basta con agregar una entrada a BASE_CONOCIMIENTO.

export const CATEGORIAS = [
  { id: 'plataforma', nombre: 'Uso de la plataforma', corto: 'Plataforma', descripcion: 'Cómo aportar, consultar y descargar en el Observatorio' },
  { id: 'git', nombre: 'Git', corto: 'Git', descripcion: 'Fundamentos, comandos y configuración de equipos' },
  { id: 'gitflow', nombre: 'GitFlow', corto: 'GitFlow', descripcion: 'Ramas, flujo de trabajo y pull request' },
];

export const BASE_CONOCIMIENTO = [
  // ─────────────────────────── PLATAFORMA ───────────────────────────
  {
    id: 'plat-que-es',
    categoria: 'plataforma',
    pregunta: '¿Qué es el Observatorio Curricular?',
    claves: ['que es', 'observatorio', 'para que sirve', 'plataforma', 'proposito', 'objetivo de la plataforma'],
    respuesta:
      'Es la plataforma donde el equipo docente construye de forma colaborativa los planeadores y los objetivos de enseñanza y aprendizaje del programa Técnico Laboral como Asistente en Desarrollo de Software. Reúne los nueve submódulos, sus aportes de saberes, sus planeadores y su valoración de alineación. No es un producto cerrado: es un punto de encuentro para socializar, debatir, aportar y modificar.',
    relacionados: ['plat-aportar', 'plat-descargar-planeador'],
  },
  {
    id: 'plat-ingresar',
    categoria: 'plataforma',
    pregunta: '¿Cómo se ingresa y qué rol se debe elegir?',
    claves: ['ingresar', 'entrar', 'identificarse', 'login', 'rol', 'usuario', 'iniciar sesion', 'registrarse'],
    respuesta:
      'Se ingresa desde el botón de identificación del encabezado. La mayoría de los roles solo pide el nombre: Docente, Experto externo, Coordinador académico y Administrador. El rol de Super administrador es el único que solicita usuario y contraseña, porque habilita acciones de escritura sobre el planeador.',
    pasos: [
      'Abra el botón de identificación en la parte superior derecha.',
      'Seleccione el rol que corresponda en la lista.',
      'Escriba su nombre y confirme.',
    ],
    relacionados: ['plat-superadmin'],
  },
  {
    id: 'plat-aportar',
    categoria: 'plataforma',
    pregunta: '¿Cómo se registra un aporte de saberes?',
    claves: ['aporte', 'aportar', 'saberes', 'saber hacer', 'saber ser', 'registrar aporte', 'pestaña aportes', 'contribuir'],
    respuesta:
      'Cada docente registra, en la pestaña Aportes de su submódulo, su comprensión de los tres saberes de la formación por competencias: el saber (conocimientos), el saber hacer (destrezas aplicadas) y el saber ser (autonomía y responsabilidad). El aporte queda asociado a su nombre y puede editarse después: al guardar de nuevo se actualiza el mismo registro, no se duplica.',
    pasos: [
      'Entre a la materia desde el menú lateral o desde el listado del inicio.',
      'Abra la pestaña Aportes.',
      'Diligencie los tres campos: saber, saber hacer y saber ser.',
      'Guarde. Su aporte aparecerá en la lista junto al de los demás docentes.',
    ],
    relacionados: ['plat-definicion', 'plat-que-es'],
  },
  {
    id: 'plat-definicion',
    categoria: 'plataforma',
    pregunta: '¿Qué es la definición única de la materia?',
    claves: ['definicion unica', 'definicion', 'sintesis', 'consenso', 'criterio unificador', 'nucleo comun'],
    respuesta:
      'Es el criterio unificador de cada asignatura: la síntesis de los aportes de los distintos docentes en una sola definición de qué se enseña, qué debe ser capaz de hacer el estudiante y qué competencias transversales se desarrollan. No busca uniformar la forma de enseñar de cada profesor, sino garantizar un núcleo común de formación en todos los grupos.',
    relacionados: ['plat-aportar'],
  },
  {
    id: 'plat-planeador',
    categoria: 'plataforma',
    pregunta: '¿Dónde se consulta el planeador de una materia?',
    claves: ['planeador', 'ver planeador', 'semanas', 'tematicas', 'consultar planeador', 'pestaña planeador'],
    respuesta:
      'En la pestaña Planeador de cada materia. Allí se ve el planeador semana por semana, con las temáticas, los resultados de aprendizaje y las observaciones registradas. Es la misma información del formato institucional, presentada para leerse en pantalla.',
    relacionados: ['plat-descargar-planeador', 'plat-proponer'],
  },
  {
    id: 'plat-descargar-planeador',
    categoria: 'plataforma',
    pregunta: '¿Cómo se descarga el planeador en Excel?',
    claves: ['descargar', 'exportar', 'excel', 'bajar planeador', 'descargar planeador', 'archivo', 'ftcocu'],
    respuesta:
      'Desde la pestaña Planeador de la materia hay un botón para exportar. El archivo se descarga en el formato institucional FTCOCU-129, conservando la estructura, las fórmulas y el diseño del original. Las temáticas que se agregaron respecto del planeador original aparecen resaltadas en verde, para que se distinga de un vistazo qué cambió.',
    pasos: [
      'Entre a la materia y abra la pestaña Planeador.',
      'Use el botón de exportar o descargar.',
      'Abra el archivo en Excel: lo nuevo estará en verde y negrita.',
    ],
    relacionados: ['plat-planeador', 'plat-verde'],
  },
  {
    id: 'plat-verde',
    categoria: 'plataforma',
    pregunta: '¿Por qué hay líneas en verde en el planeador descargado?',
    claves: ['verde', 'resaltado', 'color', 'lineas verdes', 'que cambio', 'diferencia'],
    respuesta:
      'El verde marca lo que está en la plataforma y no estaba en el planeador original de la materia. Es un comparativo automático: sirve para revisar rápidamente qué se incorporó en esta versión sin tener que confrontar los dos archivos línea por línea.',
    relacionados: ['plat-descargar-planeador'],
  },
  {
    id: 'plat-proponer',
    categoria: 'plataforma',
    pregunta: '¿Cómo se propone incluir, ajustar o retirar un contenido?',
    claves: ['proponer', 'sugerencia', 'sugerir', 'ajustar', 'retirar', 'modificar planeador', 'cambio', 'propuesta'],
    respuesta:
      'Cualquier docente puede registrar una propuesta desde la ficha de la materia, indicando el tema y la justificación. La propuesta no modifica el planeador por sí sola: queda registrada para que la mesa técnica la revise. Así el planeador cambia por acuerdo y no por edición individual.',
    pasos: [
      'Abra la materia y ubique la sección de sugerencias en la ficha.',
      'Indique si propone incluir, ajustar o retirar un contenido.',
      'Escriba el tema y la justificación.',
      'Guarde: la propuesta queda visible para el resto del equipo.',
    ],
    relacionados: ['plat-viabilidad', 'plat-superadmin'],
  },
  {
    id: 'plat-superadmin',
    categoria: 'plataforma',
    pregunta: '¿Quién puede incluir efectivamente un contenido en el planeador?',
    claves: ['incluir en el planeador', 'super administrador', 'superadmin', 'permiso', 'quien puede', 'editar planeador', 'aprobar'],
    respuesta:
      'Solo el rol de Super administrador ve el botón que incorpora una propuesta al planeador. Los demás roles pueden proponer y justificar, pero no escriben sobre el planeador. Es una salvaguarda para que el documento institucional refleje decisiones de la mesa técnica y no cambios sueltos.',
    relacionados: ['plat-proponer', 'plat-ingresar'],
  },
  {
    id: 'plat-radar',
    categoria: 'plataforma',
    pregunta: '¿Qué significa el radar de alineación de la materia?',
    claves: ['radar', 'alineacion', 'grafica', 'puntaje', 'indice', 'valoracion', 'dimensiones', 'ejes'],
    respuesta:
      'Es la valoración de la materia en cuatro dimensiones: perfil Consultor Tech, Marco Nacional de Cualificaciones, empleabilidad y estrategia pedagógica. Combina una rúbrica experta de pesos publicados con una lectura automática del contenido real del planeador. No es una calificación al docente: es un mapa de dónde está el submódulo y qué le falta.',
    relacionados: ['plat-puntaje-cambia', 'plat-viabilidad'],
  },
  {
    id: 'plat-puntaje-cambia',
    categoria: 'plataforma',
    pregunta: '¿El puntaje de alineación puede cambiar solo?',
    claves: ['cambia solo', 'subio', 'bajo el puntaje', 'por que cambio', 'varia', 'se recalcula', 'estable'],
    respuesta:
      'No. El puntaje se calcula una sola vez y queda guardado, asociado al texto del planeador que lo produjo. Solo se vuelve a calcular si ese texto cambia, es decir, si alguien editó el planeador. Si un índice subió o bajó, la causa es una edición del contenido, no una fluctuación de la herramienta.',
    relacionados: ['plat-radar'],
  },
  {
    id: 'plat-viabilidad',
    categoria: 'plataforma',
    pregunta: '¿Qué hace el análisis de viabilidad de las propuestas?',
    claves: ['viabilidad', 'analizar propuestas', 'ranking', 'mas viable', 'priorizar'],
    respuesta:
      'Toma las propuestas registradas para la materia y las ordena según qué tan viable resulta incorporarlas, indicando para cada una los ejes con los que dialoga y la razón de la valoración. Es un insumo para la conversación de la mesa técnica, no una decisión automática.',
    relacionados: ['plat-proponer', 'plat-radar'],
  },
  {
    id: 'plat-integrador',
    categoria: 'plataforma',
    pregunta: '¿Para qué sirve el generador de proyecto integrador?',
    claves: ['integrador', 'proyecto integrador', 'diseñar pi', 'generar proyecto', 'pi con ia'],
    respuesta:
      'Diseña una propuesta de proyecto integrador para el nivel a partir de una idea, con hitos, entregables y propuesta didáctica. Ajusta lo que pide en cada hito a lo que el planeador realmente ha cubierto hasta esa semana, de modo que no exija temas que aún no se han visto. El resultado se puede descargar en PDF.',
    relacionados: ['plat-bootcamp'],
  },
  {
    id: 'plat-bootcamp',
    categoria: 'plataforma',
    pregunta: '¿Qué genera la pestaña Bootcamp?',
    claves: ['bootcamp', 'reto', 'jornada', 'agenda', 'rubrica'],
    respuesta:
      'Genera la propuesta de un bootcamp de un día a partir de un reto: agenda por bloques, competencias, entregables y rúbrica de evaluación con tres niveles de desempeño. Respeta el alcance del nivel, de modo que un Nivel I no termine exigiendo temas de niveles superiores. También se descarga en PDF.',
    relacionados: ['plat-integrador'],
  },
  {
    id: 'plat-vigilancia',
    categoria: 'plataforma',
    pregunta: '¿Qué es la sección de vigilancia tecnológica?',
    claves: ['vigilancia', 'vigilancia tecnologica', 'necesidades', 'empresas', 'banco de retos', 'inteligencia competitiva'],
    respuesta:
      'Es el espacio donde las empresas registran necesidades reales que pueden convertirse en retos para los estudiantes. Recoge la demanda, no la valoración: la empresa describe su necesidad, su criticidad y su disposición a acompañar, y CESDE decide después qué se puede convertir en proyecto. Se llega desde la pestaña Integrador de cualquier materia.',
    relacionados: ['plat-integrador'],
  },
  {
    id: 'plat-ia-falla',
    categoria: 'plataforma',
    pregunta: '¿Por qué a veces la IA responde que se alcanzó un límite?',
    claves: ['limite', 'error de ia', 'no genera', 'falla la ia', 'rate limit', 'tokens', 'no funciona la ia'],
    respuesta:
      'Las funciones de inteligencia artificial usan un plan con un cupo diario compartido. Si se agota, todas las funciones de IA devuelven un aviso de límite hasta que el cupo se restablece. No es un error de los datos ni una pérdida de información: el contenido guardado sigue intacto. Por eso los resultados se guardan en caché, para generarlos una sola vez.',
    relacionados: ['plat-puntaje-cambia'],
  },

  // ─────────────────────────────── GIT ───────────────────────────────
  {
    id: 'git-que-es',
    categoria: 'git',
    pregunta: '¿Qué es Git y para qué sirve?',
    claves: ['que es git', 'para que sirve git', 'control de versiones', 'versionamiento'],
    respuesta:
      'Git es un sistema de control de versiones: guarda el historial de cambios de un proyecto y permite que varias personas trabajen sobre el mismo código sin pisarse. Cada cambio queda registrado con su autor, su fecha y su motivo, de modo que siempre se puede saber quién hizo qué y volver atrás si algo se rompe.',
    relacionados: ['git-config', 'git-primer-commit'],
  },
  {
    id: 'git-config',
    categoria: 'git',
    pregunta: '¿Cómo se configura el usuario de Git en un equipo?',
    claves: ['configurar', 'usuario', 'nombre', 'correo', 'config', 'identidad', 'quien soy'],
    respuesta:
      'Antes del primer commit hay que decirle a Git quién es usted. Esa identidad queda escrita en cada cambio que registre. En un equipo compartido conviene configurarla por repositorio y no globalmente, para que el commit no quede a nombre de quien usó la máquina antes.',
    comandos: [
      { cmd: 'git config --global user.name "Nombre Apellido"', nota: 'Identidad para todos los repositorios del equipo' },
      { cmd: 'git config --global user.email "correo@ejemplo.com"', nota: 'Debe coincidir con el correo de la cuenta remota' },
      { cmd: 'git config user.name "Nombre Apellido"', nota: 'Solo para el repositorio actual (recomendado en salas compartidas)' },
      { cmd: 'git config --list', nota: 'Verifica la configuración vigente' },
    ],
    relacionados: ['git-credenciales', 'git-que-es'],
  },
  {
    id: 'git-credenciales',
    categoria: 'git',
    pregunta: '¿Cómo se limpian las credenciales guardadas en un equipo compartido?',
    claves: ['credenciales', 'contraseña guardada', 'limpiar', 'cerrar sesion', 'cuenta de otro', 'permission denied', 'token', 'autenticacion'],
    respuesta:
      'En salas compartidas el problema más común es que el equipo quedó autenticado con la cuenta de otra persona, y los cambios se rechazan o quedan a su nombre. Las credenciales no se borran con Git sino desde el gestor de credenciales del sistema operativo. En Windows están en el Administrador de credenciales, dentro de las credenciales de Windows, con entradas que empiezan por git.',
    pasos: [
      'Abra el Administrador de credenciales de Windows desde el menú de inicio.',
      'Entre a Credenciales de Windows.',
      'Busque las entradas que empiecen por git: y elimínelas.',
      'Vuelva a ejecutar la operación en Git: pedirá autenticarse de nuevo.',
    ],
    comandos: [
      { cmd: 'git config --global credential.helper', nota: 'Muestra qué gestor de credenciales está en uso' },
      { cmd: 'git config --global --unset credential.helper', nota: 'Deja de guardar credenciales en ese equipo' },
    ],
    relacionados: ['git-config', 'git-remoto'],
  },
  {
    id: 'git-primer-commit',
    categoria: 'git',
    pregunta: '¿Cómo se hace el primer commit?',
    claves: ['commit', 'primer commit', 'guardar cambios', 'add', 'confirmar', 'init', 'empezar repositorio'],
    respuesta:
      'Un commit tiene dos pasos: primero se seleccionan los archivos que entran al cambio y luego se confirma con un mensaje que explique qué se hizo y por qué. El mensaje es parte del trabajo: es lo que otra persona leerá dentro de seis meses para entender la decisión.',
    comandos: [
      { cmd: 'git init', nota: 'Crea el repositorio en la carpeta actual' },
      { cmd: 'git status', nota: 'Muestra qué cambió y qué está seleccionado' },
      { cmd: 'git add .', nota: 'Selecciona todos los cambios; con un nombre de archivo, solo ese' },
      { cmd: 'git commit -m "Agrega el formulario de registro"', nota: 'Confirma el cambio con su mensaje' },
      { cmd: 'git log --oneline', nota: 'Revisa el historial de commits' },
    ],
    relacionados: ['git-que-es', 'git-gitignore', 'git-deshacer'],
  },
  {
    id: 'git-gitignore',
    categoria: 'git',
    pregunta: '¿Para qué sirve el archivo .gitignore?',
    claves: ['gitignore', 'ignorar', 'node modules', 'archivos que no', 'excluir', 'env'],
    respuesta:
      'Lista los archivos y carpetas que Git no debe registrar: dependencias descargables, archivos de configuración local, credenciales y binarios generados. Se crea en la raíz del proyecto. Es importante definirlo antes del primer commit, porque un archivo ya registrado sigue en el historial aunque después se agregue al .gitignore.',
    comandos: [
      { cmd: 'node_modules/', nota: 'Dependencias: se reinstalan, no se versionan' },
      { cmd: '.env', nota: 'Nunca suba credenciales al repositorio' },
      { cmd: 'git rm --cached archivo', nota: 'Saca del seguimiento un archivo que ya se había registrado' },
    ],
    relacionados: ['git-primer-commit'],
  },
  {
    id: 'git-ramas',
    categoria: 'git',
    pregunta: '¿Cómo se crea y se cambia de rama?',
    claves: ['rama', 'ramas', 'branch', 'crear rama', 'cambiar de rama', 'checkout', 'switch'],
    respuesta:
      'Una rama es una línea de trabajo paralela: permite desarrollar algo sin tocar el código estable. La regla práctica es no trabajar nunca directamente sobre la rama principal, sino abrir una rama por cada cambio y unirla cuando esté lista y probada.',
    comandos: [
      { cmd: 'git branch', nota: 'Lista las ramas y señala en cuál está' },
      { cmd: 'git switch -c feature/login', nota: 'Crea la rama y se ubica en ella' },
      { cmd: 'git switch main', nota: 'Vuelve a la rama principal' },
      { cmd: 'git branch -d feature/login', nota: 'Borra la rama una vez integrada' },
    ],
    relacionados: ['git-merge', 'gf-que-es'],
  },
  {
    id: 'git-merge',
    categoria: 'git',
    pregunta: '¿Cómo se unen dos ramas?',
    claves: ['merge', 'unir', 'fusionar', 'integrar rama', 'combinar'],
    respuesta:
      'Se ubica en la rama que va a recibir los cambios y desde allí incorpora la otra. Antes de unir conviene actualizar la rama destino, para integrar sobre la versión más reciente y reducir la probabilidad de conflictos.',
    comandos: [
      { cmd: 'git switch main', nota: 'Ubíquese en la rama que recibe' },
      { cmd: 'git pull', nota: 'Actualice antes de integrar' },
      { cmd: 'git merge feature/login', nota: 'Incorpora la rama de trabajo' },
    ],
    relacionados: ['git-conflictos', 'git-ramas'],
  },
  {
    id: 'git-conflictos',
    categoria: 'git',
    pregunta: '¿Qué se hace cuando aparece un conflicto?',
    claves: ['conflicto', 'conflictos', 'merge conflict', 'head', 'resolver conflicto', 'se dañó', 'marcas raras'],
    respuesta:
      'Un conflicto aparece cuando dos personas cambiaron las mismas líneas y Git no puede decidir cuál queda. No es un error: es una pregunta. Git marca el archivo con las dos versiones y usted debe dejar el texto final, quitando las marcas, y luego confirmar la resolución.',
    pasos: [
      'Ejecute git status para ver qué archivos están en conflicto.',
      'Abra cada archivo: verá las marcas <<<<<<<, ======= y >>>>>>>.',
      'Deje el contenido que debe quedar y borre las tres marcas.',
      'Registre el archivo resuelto con git add y confirme con git commit.',
    ],
    comandos: [
      { cmd: 'git status', nota: 'Lista los archivos en conflicto' },
      { cmd: 'git add archivo', nota: 'Marca el archivo como resuelto' },
      { cmd: 'git merge --abort', nota: 'Cancela la integración y vuelve al estado anterior' },
    ],
    relacionados: ['git-merge', 'git-deshacer'],
  },
  {
    id: 'git-remoto',
    categoria: 'git',
    pregunta: '¿Cómo se sube y se baja el trabajo del repositorio remoto?',
    claves: ['push', 'pull', 'subir', 'bajar', 'remoto', 'github', 'clonar', 'clone', 'fetch'],
    respuesta:
      'El repositorio remoto es la copia compartida del equipo. Se baja lo que hicieron los demás antes de subir lo propio: así se resuelven los conflictos en su equipo y no en el del resto. La primera vez que sube una rama nueva hay que indicar a dónde se enlaza.',
    comandos: [
      { cmd: 'git clone https://github.com/usuario/repositorio.git', nota: 'Trae por primera vez un repositorio existente' },
      { cmd: 'git pull', nota: 'Baja e integra lo que hicieron los demás' },
      { cmd: 'git push', nota: 'Sube sus commits al remoto' },
      { cmd: 'git push -u origin feature/login', nota: 'Primera subida de una rama nueva' },
    ],
    relacionados: ['git-credenciales', 'gf-pull-request'],
  },
  {
    id: 'git-deshacer',
    categoria: 'git',
    pregunta: '¿Cómo se deshace un cambio o un commit?',
    claves: ['deshacer', 'revertir', 'volver atras', 'reset', 'restore', 'me equivoque', 'borrar commit', 'recuperar'],
    respuesta:
      'Depende de dónde esté el cambio. Si aún no lo confirmó, puede descartarlo. Si ya hizo el commit pero no lo subió, puede rehacerlo. Si ya lo subió y otros lo bajaron, lo correcto no es borrar el historial sino crear un commit que revierta el anterior.',
    comandos: [
      { cmd: 'git restore archivo', nota: 'Descarta cambios no confirmados de un archivo' },
      { cmd: 'git reset --soft HEAD~1', nota: 'Deshace el último commit y conserva los cambios' },
      { cmd: 'git revert abc1234', nota: 'Crea un commit que revierte otro ya publicado' },
    ],
    relacionados: ['git-primer-commit', 'git-conflictos'],
  },

  // ───────────────────────────── GITFLOW ─────────────────────────────
  {
    id: 'gf-que-es',
    categoria: 'gitflow',
    pregunta: '¿Qué es GitFlow?',
    claves: ['gitflow', 'git flow', 'que es gitflow', 'estrategia de ramas', 'modelo de ramas', 'flujo'],
    respuesta:
      'GitFlow es un acuerdo sobre para qué sirve cada rama, de modo que todo el equipo trabaje igual. Define dos ramas permanentes, main con lo que está en producción y develop con lo que se va integrando, y ramas temporales para cada tipo de trabajo. Su valor no es técnico sino de coordinación: elimina la discusión de dónde va cada cosa.',
    relacionados: ['gf-ramas', 'gf-feature'],
  },
  {
    id: 'gf-ramas',
    categoria: 'gitflow',
    pregunta: '¿Qué ramas define GitFlow y para qué sirve cada una?',
    claves: ['ramas de gitflow', 'main', 'develop', 'release', 'hotfix', 'tipos de rama', 'nomenclatura'],
    respuesta:
      'Son cinco tipos. Main guarda lo que está en producción y solo recibe versiones probadas. Develop es la rama de integración donde converge el trabajo del equipo. Feature es una rama por cada funcionalidad nueva. Release prepara una versión para publicarla. Hotfix corrige un error urgente que ya está en producción.',
    comandos: [
      { cmd: 'main', nota: 'Producción. Estable, nadie trabaja directamente sobre ella' },
      { cmd: 'develop', nota: 'Integración del equipo' },
      { cmd: 'feature/nombre', nota: 'Una funcionalidad nueva; sale de develop y vuelve a develop' },
      { cmd: 'release/1.0', nota: 'Preparación de una versión; sale de develop y va a main' },
      { cmd: 'hotfix/nombre', nota: 'Corrección urgente; sale de main y vuelve a main y develop' },
    ],
    relacionados: ['gf-que-es', 'gf-feature'],
  },
  {
    id: 'gf-feature',
    categoria: 'gitflow',
    pregunta: '¿Cómo se trabaja una funcionalidad nueva con GitFlow?',
    claves: ['feature', 'funcionalidad', 'nueva caracteristica', 'como trabajo', 'flujo de trabajo', 'paso a paso'],
    respuesta:
      'Toda funcionalidad nace de develop actualizada, se desarrolla en su propia rama con commits pequeños y regresa a develop mediante pull request. La rama se borra una vez integrada: su historia ya quedó en develop.',
    pasos: [
      'Ubíquese en develop y actualícela con git pull.',
      'Cree la rama de la funcionalidad: git switch -c feature/nombre.',
      'Trabaje con commits pequeños y con mensajes que expliquen el porqué.',
      'Suba la rama con git push -u origin feature/nombre.',
      'Abra el pull request hacia develop y espere la revisión.',
      'Una vez integrada, borre la rama.',
    ],
    relacionados: ['gf-pull-request', 'git-ramas'],
  },
  {
    id: 'gf-pull-request',
    categoria: 'gitflow',
    pregunta: '¿Qué es un pull request y cómo se revisa?',
    claves: ['pull request', 'pr', 'revision', 'code review', 'revisar codigo', 'aprobar', 'merge request'],
    respuesta:
      'Es la solicitud de integrar una rama en otra, y sobre todo el espacio donde otra persona revisa el cambio antes de que entre. Su valor está en la conversación: quien revisa pregunta, sugiere y aprende, y quien propone justifica sus decisiones. Un pull request que se aprueba sin leerlo pierde todo su sentido.',
    pasos: [
      'Suba su rama al repositorio remoto.',
      'Abra el pull request indicando la rama origen y la rama destino.',
      'Describa qué resuelve, cómo lo resolvió y qué debería revisar el otro.',
      'Atienda los comentarios con nuevos commits sobre la misma rama.',
      'Integre cuando tenga la aprobación.',
    ],
    relacionados: ['gf-feature', 'git-remoto'],
  },
  {
    id: 'gf-hotfix',
    categoria: 'gitflow',
    pregunta: '¿Qué se hace ante un error urgente en producción?',
    claves: ['hotfix', 'urgente', 'error en produccion', 'bug critico', 'arreglo rapido'],
    respuesta:
      'Se abre una rama hotfix a partir de main, no de develop, porque el objetivo es corregir exactamente lo que está publicado. Una vez probada, se integra en main para publicar la corrección y también en develop, para que el arreglo no se pierda en la siguiente versión.',
    pasos: [
      'Cree la rama desde main: git switch main y luego git switch -c hotfix/nombre.',
      'Corrija y confirme el cambio.',
      'Integre en main y publique la corrección.',
      'Integre también en develop para conservar el arreglo.',
    ],
    relacionados: ['gf-ramas'],
  },
  {
    id: 'gf-mensajes',
    categoria: 'gitflow',
    pregunta: '¿Cómo se escriben buenos mensajes de commit?',
    claves: ['mensaje', 'mensajes de commit', 'buenas practicas', 'como escribir', 'convencion'],
    respuesta:
      'Un buen mensaje dice qué cambió y por qué, en presente y de forma concreta. Evite mensajes como cambios, ajustes o ok: no le sirven a nadie dentro de tres meses. Un commit debe corresponder a una idea completa: si el mensaje necesita la palabra y varias veces, probablemente deban ser dos commits.',
    comandos: [
      { cmd: 'git commit -m "Corrige el cálculo del total en la factura"', nota: 'Concreto: se entiende sin abrir el código' },
      { cmd: 'git commit -m "cambios"', nota: 'Evítelo: no aporta información' },
    ],
    relacionados: ['git-primer-commit', 'gf-pull-request'],
  },
];

// ─────────────────────── Emparejamiento local ───────────────────────

const VACIAS = new Set([
  'que', 'como', 'cual', 'cuales', 'donde', 'cuando', 'quien', 'quienes', 'por', 'para', 'porque',
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al', 'a', 'en', 'y', 'o',
  'se', 'es', 'son', 'esta', 'estan', 'ser', 'hay', 'con', 'sin', 'sobre', 'me', 'mi', 'yo', 'te',
  'su', 'sus', 'lo', 'le', 'si', 'no', 'mas', 'muy', 'puedo', 'puede', 'debo', 'debe', 'hacer',
  'tengo', 'tiene', 'quiero', 'necesito', 'ayuda', 'favor', 'gracias', 'sirve', 'usa', 'usar',
]);

/** Minúsculas, sin tildes ni signos: para comparar sin depender de cómo se escriba. */
export function normalizar(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9ñ\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenizar(texto) {
  return normalizar(texto)
    .split(' ')
    .filter(t => t.length > 2 && !VACIAS.has(t));
}

/**
 * Puntúa cada entrada frente a la pregunta y devuelve las mejores.
 * Una clave que aparece completa pesa mucho más que una palabra suelta,
 * porque las claves son frases que identifican el tema.
 */
export function buscarEnBase(pregunta, limite = 3) {
  const norm = normalizar(pregunta);
  const tokens = tokenizar(pregunta);
  if (!norm) return [];

  const resultados = BASE_CONOCIMIENTO.map(entrada => {
    let puntaje = 0;

    for (const clave of entrada.claves) {
      const claveNorm = normalizar(clave);
      if (!claveNorm) continue;
      if (norm.includes(claveNorm)) {
        // Las claves de varias palabras son mucho más específicas.
        puntaje += claveNorm.includes(' ') ? 10 : 5;
      }
    }

    const tokensEntrada = new Set([
      ...tokenizar(entrada.pregunta),
      ...entrada.claves.flatMap(c => tokenizar(c)),
    ]);
    for (const t of tokens) {
      if (tokensEntrada.has(t)) puntaje += 2;
    }

    // Normaliza por longitud de la pregunta para que preguntas largas
    // no acumulen puntaje solo por tener más palabras.
    const factor = tokens.length ? Math.min(1, 4 / tokens.length) : 1;
    return { entrada, puntaje: puntaje * (0.5 + 0.5 * factor) };
  });

  return resultados
    .filter(r => r.puntaje > 0)
    .sort((a, b) => b.puntaje - a.puntaje)
    .slice(0, limite);
}

/** A partir de este puntaje la coincidencia se considera segura y se responde sin IA. */
export const UMBRAL_DIRECTO = 7;

/** Preguntas que se ofrecen como atajo al abrir el asistente. */
export const SUGERENCIAS_INICIALES = [
  'plat-aportar',
  'plat-descargar-planeador',
  'plat-proponer',
  'git-credenciales',
  'git-conflictos',
  'gf-que-es',
];

export function entradaPorId(id) {
  return BASE_CONOCIMIENTO.find(e => e.id === id) || null;
}

/** Texto plano de una entrada, para enviarlo como contexto a la IA. */
export function entradaComoContexto(entrada) {
  const partes = [`Pregunta: ${entrada.pregunta}`, `Respuesta: ${entrada.respuesta}`];
  if (entrada.pasos) partes.push('Pasos: ' + entrada.pasos.join(' | '));
  if (entrada.comandos) partes.push('Comandos: ' + entrada.comandos.map(c => `${c.cmd} (${c.nota})`).join(' | '));
  return partes.join('\n');
}
