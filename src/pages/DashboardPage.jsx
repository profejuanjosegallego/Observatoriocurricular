import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { NIVELES, getMateriasPorNivel } from '../data/materias';

const AUDIO_SCRIPT = `El Consultor Tech es mucho más que un programador.
Mientras que un asistente tradicional en desarrollo de software se limita a ejecutar tareas técnicas asignadas por un líder, el Consultor Tech interpreta las necesidades del cliente, diseña soluciones tecnológicas a medida y acompaña su implementación de principio a fin.
Se diferencia por combinar cuatro pilares fundamentales: dominio técnico, pensamiento estratégico, comunicación efectiva y visión integral del proyecto.
En CESDE, el programa forma este perfil de manera progresiva a través de tres niveles.
Primero como Intérprete, aprendiendo a comprender el problema del cliente.
Luego como Arquitecto, estructurando soluciones completas con metodología ágil.
Y finalmente como Socio Tecnológico, acompañando al cliente con fundamento técnico y visión de negocio, desde el diagnóstico hasta el despliegue en producción.`;

const SABERES = [
  {
    titulo: 'Saber',
    subtitulo: 'Conocimientos',
    color: '#6366f1',
    items: [
      'Algoritmos, pseudocódigo, variables, tipos de datos, condicionales, ciclos, funciones y arreglos',
      'HTML5 semántico, CSS3 (Flexbox, Grid), frameworks de estilos, Git y control de versiones',
      'Modelos E-R, normalización (1FN-3FN), SQL (DDL/DML/DCL), procedimientos almacenados, MongoDB y Power BI',
      'Programación Orientada a Objetos: clases, herencia, polimorfismo, interfaces, JPA + Hibernate',
      'JavaScript (DOM, eventos, promesas, async/await, fetch, API REST)',
      'Requisitos de software, casos de uso, reglas de negocio, Scrum, Kanban',
      'Spring Boot, API REST, Swagger, DTOs, JUnit, patrones MVC',
      'React (SPA, Router, hooks, consumo de API), arquitectura web, despliegue',
      'Python, Pandas, Matplotlib, Seaborn, fundamentos de IA, análisis de datos',
    ],
  },
  {
    titulo: 'Saber-hacer',
    subtitulo: 'Habilidades',
    color: '#E6007E',
    items: [
      'Construir algoritmos que resuelvan problemas de complejidad intermedia con pruebas de escritorio',
      'Maquetar páginas web responsivas con HTML5, CSS3 y frameworks, versionando con Git',
      'Diseñar bases de datos normalizadas, ejecutar consultas con JOINs y crear procedimientos almacenados',
      'Desarrollar aplicaciones Java con POO, persistir datos con JPA/Hibernate',
      'Programar aplicaciones web interactivas que consuman API REST con JavaScript',
      'Levantar requisitos, especificar casos de uso, gestionar proyectos con Scrum',
      'Construir API REST profesionales con Spring Boot, documentar con Swagger, probar con JUnit',
      'Crear Single-Page Applications con React, configurar dominios, desplegar en servidores',
      'Analizar datos con Pandas, visualizar con Matplotlib/Seaborn, generar reportes en HTML',
    ],
  },
  {
    titulo: 'Saber-ser',
    subtitulo: 'Actitudes y valores',
    color: '#10b981',
    items: [
      'Pensamiento analítico y persistencia ante el error',
      'Creatividad, atención al detalle y adaptabilidad al cambio tecnológico',
      'Responsabilidad con la integridad de los datos y ética en el manejo de información',
      'Disciplina en convenciones de código y disposición para la depuración',
      'Curiosidad tecnológica y comunicación técnica clara',
      'Escucha activa, empatía con el cliente y trabajo en equipo',
      'Rigurosidad en documentación y compromiso con la calidad',
      'Orientación al detalle y profesionalismo en la entrega',
      'Pensamiento crítico ante la IA y apertura a la innovación',
    ],
  },
];

const FORTALEZAS = [
  { titulo: 'Integración por niveles', detalle: 'Tres niveles progresivos con proyecto integrador que conecta todas las materias de cada nivel en un solo producto funcional.', icono: 'layers' },
  { titulo: 'Perfil Consultor Tech', detalle: 'El egresado no solo programa: interpreta necesidades, diseña soluciones y asesora al cliente con fundamento técnico.', icono: 'user' },
  { titulo: 'Bootcamp con empresa real', detalle: 'Al final de cada nivel, un bootcamp de un día con una empresa del territorio que presenta un reto real para resolver.', icono: 'bolt' },
  { titulo: 'Modelo Data / Agile / API', detalle: 'Cada nivel sigue un modelo de integración que refleja prácticas reales de la industria: Data-First, Agile-First, API-First.', icono: 'chart' },
  { titulo: 'Full-stack progresivo', detalle: 'Desde HTML+CSS+SQL en Nivel I hasta React+Spring Boot+Python en Nivel III: el estudiante construye su perfil capa a capa.', icono: 'stack' },
  { titulo: 'Alineado con el MNC', detalle: 'Competencias diseñadas según el Marco Nacional de Cualificaciones (Decreto 1649/2021) para formación técnica laboral.', icono: 'shield' },
];

const COMPARATIVO = [
  {
    dimension: 'Rol en la empresa',
    asistente: 'Ejecuta tareas asignadas por un líder técnico',
    consultor: 'Interpreta necesidades del cliente, propone soluciones y acompaña su implementación',
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.193 23.193 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    dimension: 'Habilidad diferencial',
    asistente: 'Dominio de herramientas y lenguajes de programación',
    consultor: 'Pensamiento estratégico + comunicación + dominio técnico',
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    dimension: 'Relación con el cliente',
    asistente: 'Indirecta: recibe especificaciones ya definidas',
    consultor: 'Directa: diagnostica, pregunta, modela y valida con el cliente',
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    dimension: 'Alcance del trabajo',
    asistente: 'Componentes individuales (una pantalla, una tabla, un módulo)',
    consultor: 'Solución integral: desde el análisis del problema hasta el despliegue',
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
  },
  {
    dimension: 'Evolución profesional',
    asistente: 'Desarrollador junior con ruta hacia roles técnicos',
    consultor: 'Profesional híbrido con ruta hacia consultoría, arquitectura o liderazgo técnico',
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
];

const EVOLUCION = [
  {
    nivel: 'Nivel I',
    titulo: 'Intérprete',
    subtitulo: 'Comprender el problema',
    color: '#6366f1',
    modelo: 'Data-First',
    descripcion: 'El estudiante aprende a escuchar al cliente, traducir sus necesidades en modelos de datos y construir las bases técnicas del proyecto.',
    capacidades: ['Modelar bases de datos desde el problema real', 'Maquetar interfaces que comuniquen la solución', 'Aplicar lógica de programación con propósito'],
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    nivel: 'Nivel II',
    titulo: 'Arquitecto',
    subtitulo: 'Diseñar la solución',
    color: '#E6007E',
    modelo: 'Agile-First',
    descripcion: 'El estudiante estructura soluciones completas: levanta requisitos con metodología ágil, diseña backend profesional y construye frontends interactivos.',
    capacidades: ['Gestionar proyectos con Scrum y Kanban', 'Construir API REST con Spring Boot', 'Programar frontends dinámicos con JavaScript'],
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    nivel: 'Nivel III',
    titulo: 'Socio Tecnológico',
    subtitulo: 'Acompañar al cliente',
    color: '#10b981',
    modelo: 'API-First',
    descripcion: 'El estudiante integra todo: conecta frontend moderno con backend robusto, analiza datos con IA y despliega soluciones en producción, acompañando al cliente de principio a fin.',
    capacidades: ['Desplegar SPA con React y consumir APIs', 'Analizar datos con Python y generar reportes', 'Asesorar al cliente con fundamento técnico'],
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
];

const PILARES = [
  {
    titulo: 'Dominio técnico',
    detalle: 'Maneja lenguajes, frameworks y herramientas con suficiencia para construir soluciones reales.',
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    titulo: 'Pensamiento estratégico',
    detalle: 'Analiza el contexto del cliente, identifica el problema de fondo y propone la solución más adecuada.',
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    titulo: 'Comunicación efectiva',
    detalle: 'Traduce lenguaje técnico a lenguaje de negocio y viceversa, facilitando la toma de decisiones.',
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    titulo: 'Visión integral',
    detalle: 'Entiende el ciclo completo del software: desde el diagnóstico inicial hasta el despliegue y soporte.',
    icono: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const ICONOS = {
  layers: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
  user: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  bolt: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  chart: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  stack: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" /></svg>,
  shield: <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
};

export default function DashboardPage() {
  const { aporteCounts } = useOutletContext();
  const [saberesOpen, setSaberesOpen] = useState(false);
  const [audioState, setAudioState] = useState('idle');
  const utterRef = useRef(null);

  const getSpanishFemaleVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();
    const esVoices = voices.filter(v => v.lang.startsWith('es'));
    const female = esVoices.find(v =>
      /female|femenin|mujer|paulina|mónica|elena|sabina|lupe|penélope|lucia/i.test(v.name)
    );
    return female || esVoices[0] || null;
  }, []);

  const handleAudio = useCallback(() => {
    const synth = window.speechSynthesis;

    if (audioState === 'playing') {
      synth.pause();
      setAudioState('paused');
      return;
    }

    if (audioState === 'paused') {
      synth.resume();
      setAudioState('playing');
      return;
    }

    synth.cancel();
    const utter = new SpeechSynthesisUtterance(AUDIO_SCRIPT);
    utter.lang = 'es-MX';
    utter.rate = 0.92;
    utter.pitch = 1.1;
    const voice = getSpanishFemaleVoice();
    if (voice) utter.voice = voice;
    utter.onend = () => setAudioState('idle');
    utter.onerror = () => setAudioState('idle');
    utterRef.current = utter;
    synth.speak(utter);
    setAudioState('playing');
  }, [audioState, getSpanishFemaleVoice]);

  const stopAudio = useCallback(() => {
    window.speechSynthesis.cancel();
    setAudioState('idle');
  }, []);

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero */}
      <div className="bg-gradient-to-br from-ink to-[#2a1f30] text-white rounded-2xl p-8 shadow-lg shadow-magenta/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-magenta/5 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 bg-indigo-500/5 rounded-full translate-y-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <span className="text-[10px] font-bold tracking-wider uppercase bg-magenta/20 px-3 py-1 rounded-full text-magenta-soft">
              Observatorio Curricular
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase bg-white/10 px-3 py-1 rounded-full">
              CESDE · Medellín
            </span>
          </div>
          <h2 className="text-2xl font-bold font-heading mb-3 max-w-2xl leading-tight">
            Técnico Laboral como Asistente en Desarrollo de Software
          </h2>
          <p className="text-white/75 text-sm max-w-3xl leading-relaxed mb-4">
            Programa de formación técnica de 18 meses (3 niveles) que forma profesionales capaces de interpretar
            necesidades empresariales, diseñar soluciones tecnológicas y acompañar su implementación.
            Se estructura en 9 módulos distribuidos en 3 niveles progresivos, con un modelo de integración
            que conecta cada materia a un proyecto real por nivel.
          </p>
          <div className="flex gap-6 flex-wrap text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <p className="font-bold text-white">18 meses</p>
                <p className="text-white/50">3 niveles de 18 semanas</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-magenta/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-magenta-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <div>
                <p className="font-bold text-white">9 módulos</p>
                <p className="text-white/50">72 horas cada uno</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <div>
                <p className="font-bold text-white">3 bootcamps</p>
                <p className="text-white/50">Con empresa real</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fortalezas */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-6 rounded bg-gradient-to-b from-indigo-500 to-indigo-400" />
          <h3 className="font-heading font-bold text-lg text-ink">Fortalezas del programa</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FORTALEZAS.map((f, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-10 h-10 rounded-xl bg-magenta/8 flex items-center justify-center mb-3 text-magenta group-hover:bg-magenta group-hover:text-white transition-all duration-300">
                {ICONOS[f.icono]}
              </div>
              <h4 className="font-heading font-semibold text-sm text-ink mb-1">{f.titulo}</h4>
              <p className="text-xs text-ink-2 leading-relaxed">{f.detalle}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Del Asistente al Consultor Tech — Explicación expandida */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-6 rounded bg-gradient-to-b from-amber-400 to-orange-400" />
          <h3 className="font-heading font-bold text-lg text-ink">Del Asistente al Consultor Tech</h3>
        </div>
        <p className="text-sm text-ink-2 mb-6 max-w-3xl">
          El programa forma técnicos con perfil de <strong className="text-ink">Consultor Tech</strong>: profesionales que van más allá de escribir código.
          Un Consultor Tech diagnostica la necesidad del cliente, diseña la solución más adecuada y acompaña su implementación con fundamento técnico y visión de negocio.
        </p>

        {/* ¿Qué es un Consultor Tech? — Pilares */}
        <div className="bg-gradient-to-br from-ink to-[#2a1f30] rounded-2xl p-6 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-magenta/5 rounded-full -translate-y-1/3 translate-x-1/4" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-magenta-soft" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <h4 className="font-heading font-bold text-white text-sm">¿Qué define al Consultor Tech?</h4>
              <div className="flex items-center gap-1.5 ml-auto">
                <button
                  onClick={handleAudio}
                  className={`flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    audioState === 'playing'
                      ? 'bg-magenta text-white shadow-lg shadow-magenta/40'
                      : audioState === 'paused'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-white/10 text-white/70 border border-white/15 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {audioState === 'playing' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 9v6m4-6v6" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  )}
                  {audioState === 'idle' && 'Escuchar'}
                  {audioState === 'playing' && 'Pausar'}
                  {audioState === 'paused' && 'Continuar'}
                </button>
                {audioState !== 'idle' && (
                  <button
                    onClick={stopAudio}
                    className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 text-white/50 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="6" width="12" height="12" rx="1" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <p className="text-white/60 text-xs mb-5 max-w-2xl">
              No es solo un programador que sabe más: es un profesional que combina cuatro pilares para transformar problemas de negocio en soluciones tecnológicas.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {PILARES.map((p, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-300">
                  <div className="w-9 h-9 rounded-lg bg-magenta/20 flex items-center justify-center text-magenta-soft mb-3">
                    {p.icono}
                  </div>
                  <h5 className="font-heading font-semibold text-white text-xs mb-1">{p.titulo}</h5>
                  <p className="text-white/55 text-[11px] leading-relaxed">{p.detalle}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Evolución en 3 niveles — Diagrama visual */}
        <div className="mb-6">
          <h4 className="font-heading font-semibold text-sm text-ink mb-1">Evolución progresiva en 3 niveles</h4>
          <p className="text-xs text-ink-2 mb-4 max-w-2xl">
            El estudiante atraviesa tres etapas que transforman su perfil desde ejecutor técnico hasta socio estratégico del cliente.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 relative">
            {/* Línea conectora (solo desktop) */}
            <div className="hidden lg:block absolute top-[52px] left-[16.67%] right-[16.67%] h-[2px] bg-gradient-to-r from-indigo-300 via-magenta/50 to-emerald-300 z-0" />

            {EVOLUCION.map((ev, i) => (
              <div key={i} className="relative z-10">
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300">
                  {/* Encabezado con color */}
                  <div className="px-5 py-4 flex items-center gap-3" style={{ backgroundColor: ev.color + '08', borderBottom: `2px solid ${ev.color}20` }}>
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: ev.color + '15', color: ev.color }}>
                      {ev.icono}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold tracking-wider uppercase" style={{ color: ev.color }}>{ev.nivel}</span>
                        <span className="text-[9px] font-medium tracking-wider uppercase bg-gray-100 text-ink-2 px-2 py-0.5 rounded-full">{ev.modelo}</span>
                      </div>
                      <p className="font-heading font-bold text-ink text-sm">{ev.titulo}</p>
                      <p className="text-[11px] text-ink-2">{ev.subtitulo}</p>
                    </div>
                  </div>
                  {/* Cuerpo */}
                  <div className="p-5">
                    <p className="text-xs text-ink-2 leading-relaxed mb-3">{ev.descripcion}</p>
                    <div className="space-y-2">
                      {ev.capacidades.map((cap, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: ev.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          <p className="text-xs text-ink leading-relaxed">{cap}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Flecha entre cards (solo mobile) */}
                {i < 2 && (
                  <div className="flex justify-center py-2 lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-ink-2/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Comparativo — cards interactivas */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h4 className="font-heading font-semibold text-sm text-ink">Comparativo: perfil tradicional vs. Consultor Tech</h4>
          <div className="flex items-center gap-3 text-[10px] font-bold tracking-wider uppercase">
            <div className="flex items-center gap-1.5 text-ink-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              Asistente
            </div>
            <div className="flex items-center gap-1.5 text-magenta">
              <span className="w-2.5 h-2.5 rounded-full bg-magenta" />
              Consultor Tech
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {COMPARATIVO.map((row, i) => (
            <div
              key={i}
              className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-magenta/3 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-magenta/8 transition-colors duration-300" />
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-ink-2 mb-3 group-hover:bg-magenta/10 group-hover:text-magenta transition-all duration-300">
                  {row.icono}
                </div>
                <h5 className="font-heading font-semibold text-sm text-ink mb-3 group-hover:text-magenta transition-colors duration-300">{row.dimension}</h5>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="shrink-0 mt-1 w-2 h-2 rounded-full bg-gray-300" />
                    <p className="text-[11px] text-ink-2 leading-relaxed line-through decoration-gray-200 group-hover:decoration-gray-300 transition-colors duration-300">{row.asistente}</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0 mt-0.5 text-magenta" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-[11px] text-ink font-medium leading-relaxed">{row.consultor}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Saberes del programa — Colapsable */}
      <div>
        <button
          onClick={() => setSaberesOpen(!saberesOpen)}
          className="flex items-center gap-2 w-full text-left cursor-pointer group"
        >
          <div className="w-2 h-6 rounded bg-gradient-to-b from-magenta to-magenta-soft" />
          <h3 className="font-heading font-bold text-lg text-ink group-hover:text-magenta transition-colors duration-300">Saberes del programa</h3>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-5 h-5 text-ink-2 ml-1 transition-transform duration-300 ${saberesOpen ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
          {!saberesOpen && (
            <span className="text-xs text-ink-2 ml-2">3 dimensiones · 27 competencias</span>
          )}
        </button>

        <div className={`overflow-hidden transition-all duration-500 ease-in-out ${saberesOpen ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
          <p className="text-sm text-ink-2 mb-4 max-w-3xl">
            El programa se estructura bajo el enfoque de formación por competencias del Marco Nacional de Cualificaciones (Decreto 1649 de 2021), organizando los aprendizajes en tres dimensiones complementarias.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {SABERES.map(saber => (
              <div key={saber.titulo} className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                <div className="px-5 py-3 flex items-center gap-2" style={{ backgroundColor: saber.color + '08', borderBottom: `2px solid ${saber.color}20` }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: saber.color + '15' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" style={{ color: saber.color }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      {saber.titulo === 'Saber' && <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
                      {saber.titulo === 'Saber-hacer' && <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />}
                      {saber.titulo === 'Saber-ser' && <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />}
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold" style={{ color: saber.color }}>{saber.titulo}</p>
                    <p className="text-[10px] text-ink-2">{saber.subtitulo}</p>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  {saber.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: saber.color + '60' }} />
                      <p className="text-xs text-ink-2 leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Niveles y materias — CTA */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-6 rounded bg-gradient-to-b from-emerald-500 to-emerald-400" />
          <h3 className="font-heading font-bold text-lg text-ink">Explorar el programa por módulos</h3>
        </div>
        <p className="text-sm text-ink-2 mb-5 max-w-3xl">
          Haga clic en cualquier módulo para acceder a su ficha completa, los aportes de docentes, el planeador semanal, el proyecto integrador con entregables y el bootcamp del nivel.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {NIVELES.map(nv => {
            const colors = nv.nivel === 1
              ? { bg: 'from-indigo-500 to-indigo-600', accent: '#6366f1' }
              : nv.nivel === 2
                ? { bg: 'from-magenta to-magenta-dark', accent: '#E6007E' }
                : { bg: 'from-emerald-500 to-emerald-600', accent: '#10b981' };

            return (
              <div key={nv.nivel} className="space-y-3">
                <div className={`bg-gradient-to-r ${colors.bg} rounded-xl px-4 py-3 text-white`}>
                  <h4 className="font-heading font-bold text-sm">{nv.nombre}</h4>
                  <p className="text-[0.7rem] text-white/70 mt-0.5">{nv.bootcamp}</p>
                </div>

                {getMateriasPorNivel(nv.nivel).map(m => {
                  const count = aporteCounts[m.id] || 0;
                  const isLogica = m.id === 'logica';
                  return (
                    <Link
                      key={m.id}
                      to={`/materia/${m.id}`}
                      className={`flex items-center gap-3 bg-white rounded-xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group ${
                        isLogica
                          ? 'border-2 border-magenta/40 shadow-md shadow-magenta/10 ring-1 ring-magenta/10'
                          : 'border border-gray-100 hover:border-magenta/30'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h5 className={`font-heading font-semibold text-sm transition-colors duration-300 ${isLogica ? 'text-magenta' : 'text-ink group-hover:text-magenta'}`}>
                            {m.nombre}
                          </h5>
                          {isLogica && (
                            <span className="text-[9px] font-bold tracking-wider uppercase bg-magenta text-white px-2 py-0.5 rounded-full animate-pulse">
                              Comience aquí
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-ink-2 mt-1">{m.modulo} · {m.horasPresenciales} h · {count} aporte{count !== 1 ? 's' : ''}</p>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className={`w-4 h-4 group-hover:translate-x-1 transition-all duration-300 shrink-0 ${isLogica ? 'text-magenta' : 'text-ink-2/40 group-hover:text-magenta'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
