const MATERIAS_VALIDAS = [
  'logica', 'intro', 'bd', 'agiles', 'backend1',
  'frontend1', 'nuevastec', 'backend2', 'frontend2'
];

const MATERIAS_INFO = {
  logica:     { nombre: 'Lógica de Programación',              nivel: 1, bootcamp: 'El Consultor como Intérprete' },
  intro:      { nombre: 'Introducción a la Programación',      nivel: 1, bootcamp: 'El Consultor como Intérprete' },
  bd:         { nombre: 'Gestión de Bases de Datos',           nivel: 1, bootcamp: 'El Consultor como Intérprete' },
  agiles:     { nombre: 'Metodologías Ágiles',                 nivel: 2, bootcamp: 'El Arquitecto de Soluciones' },
  backend1:   { nombre: 'Backend I',                           nivel: 2, bootcamp: 'El Arquitecto de Soluciones' },
  frontend1:  { nombre: 'Frontend I',                          nivel: 2, bootcamp: 'El Arquitecto de Soluciones' },
  nuevastec:  { nombre: 'Nuevas Tecnologías de Programación',  nivel: 3, bootcamp: 'El Socio Tecnológico' },
  backend2:   { nombre: 'Backend II',                          nivel: 3, bootcamp: 'El Socio Tecnológico' },
  frontend2:  { nombre: 'Frontend II',                         nivel: 3, bootcamp: 'El Socio Tecnológico' },
};

const NIVELES = {
  1: { nombre: 'Nivel I · Fundamentos',      bootcamp: 'El Consultor como Intérprete' },
  2: { nombre: 'Nivel II · Construcción',     bootcamp: 'El Arquitecto de Soluciones' },
  3: { nombre: 'Nivel III · Especialización', bootcamp: 'El Socio Tecnológico' },
};

const ROLES = ['admin', 'docente', 'experto', 'coordinador'];

module.exports = { MATERIAS_VALIDAS, MATERIAS_INFO, NIVELES, ROLES };
