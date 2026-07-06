import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { necesidadesService } from '../services/api';

// Ciclo de vigilancia tecnológica (norma UNE 166006 adaptada al contexto formativo).
// Cada fase indica cómo la esta herramienta la aborda.
const CICLO = [
  {
    icono: 'target',
    titulo: 'Foco y planeación',
    detalle: 'Se definen las áreas, tecnologías y sectores a vigilar, alineados con el perfil del programa y la demanda real del sector.',
    herramienta: 'El foco se deriva automáticamente de la Matriz de brechas del programa y de las fuentes CUOC 2025 y Cenisoft 2025 (ver el panel de foco de vigilancia).',
  },
  {
    icono: 'antena',
    titulo: 'Captación de necesidades',
    detalle: 'Las empresas aliadas alimentan un banco de retos reales de forma continua, nutrido por el ecosistema (gremios, clústeres, egresados).',
    herramienta: 'Las empresas registran sus necesidades en el formulario de esta página; cada una ingresa al banco de retos del programa.',
  },
  {
    icono: 'filtro',
    titulo: 'Análisis y valoración',
    detalle: 'Cada necesidad se filtra y prioriza por su viabilidad para los estudiantes: pertinencia, urgencia, impacto y cobertura del foco.',
    herramienta: 'El equipo de CESDE revisa el banco de necesidades (visible para el super administrador) y prioriza según el foco de vigilancia.',
  },
  {
    icono: 'idea',
    titulo: 'Inteligencia y traducción',
    detalle: 'La necesidad priorizada se transforma en un reto académico realizable, con entregables concretos y una materia líder.',
    herramienta: 'El reto se diseña con el generador de proyecto integrador y de bootcamp con IA que ya ofrece la plataforma.',
  },
  {
    icono: 'red',
    titulo: 'Difusión y vinculación',
    detalle: 'Se empareja el reto con los equipos de estudiantes, con mentoría empresarial y seguimiento; los resultados retroalimentan el foco.',
    herramienta: 'El reto se articula en las fichas y los proyectos integradores de las materias, conectando a los estudiantes con la empresa.',
  },
];

// Foco de vigilancia (factores críticos) derivado de las fuentes oficiales de la plataforma.
const FOCO_VIGILANCIA = {
  fuente: 'Derivado de la Matriz de brechas del programa y de las fuentes CUOC 2025 (DANE) y Estudio de Empleabilidad Cenisoft 2025.',
  enfoques: [
    { nombre: 'Big Data y analítica de datos', demanda: 50 },
    { nombre: 'Inteligencia artificial y machine learning', demanda: 47 },
    { nombre: 'Computación en la nube (Azure/AWS)', demanda: 43 },
    { nombre: 'Internet de las cosas (IoT)', demanda: 42 },
    { nombre: 'Ciberseguridad', demanda: 41 },
    { nombre: 'Desarrollo full-stack', demanda: 38 },
    { nombre: 'DevOps y SRE', demanda: 36 },
    { nombre: 'Diseño UX/UI', demanda: 32 },
  ],
};

const SECTORES = ['Software y TI', 'Manufactura', 'Comercio y retail', 'Salud', 'Educación', 'Servicios financieros', 'Logística y transporte', 'Agroindustria', 'Servicios', 'Sector público', 'Otro'];
const TAMANOS = ['Microempresa', 'Pequeña', 'Mediana', 'Grande'];
const URGENCIAS = ['Alta — es prioritario', 'Media — importante pero no urgente', 'Baja — exploratorio'];
const HERRAMIENTAS_ACTUALES = ['Hojas de cálculo (Excel)', 'Un ERP o software comercial', 'Sitio web', 'Aplicación móvil', 'Software a la medida', 'Procesos manuales / en papel'];

const ICONOS = {
  target: 'M12 3a9 9 0 100 18 9 9 0 000-18zm0 4a5 5 0 100 10 5 5 0 000-10zm0 4a1 1 0 100 2 1 1 0 000-2z',
  antena: 'M8.111 16.404a5.5 5.5 0 010-7.778m7.778 0a5.5 5.5 0 010 7.778M12 20v-8m0 0a1 1 0 100-2 1 1 0 000 2zM4.929 19.071a10 10 0 010-14.142m14.142 0a10 10 0 010 14.142',
  filtro: 'M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L14 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 018 21v-7.586L3.293 6.707A1 1 0 013 6V4z',
  idea: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  red: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
};

function Icono({ name, className = 'w-5 h-5' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d={ICONOS[name] || ICONOS.idea} />
    </svg>
  );
}

function Campo({ label, children, obligatorio }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-ink mb-1.5">
        {label}{obligatorio && <span className="text-magenta"> *</span>}
      </span>
      {children}
    </label>
  );
}

const inputClass = 'w-full px-3.5 py-2.5 rounded-xl border border-magenta/15 bg-mist text-sm focus:outline-none focus:border-magenta focus:bg-white focus:ring-2 focus:ring-magenta/10 transition-all duration-300';

function BancoAdmin() {
  const [items, setItems] = useState(null);
  useEffect(() => {
    necesidadesService.listar().then(setItems).catch(() => setItems([]));
  }, []);

  if (items === null) return null;

  return (
    <section className="bg-white border border-magenta/15 rounded-2xl p-5">
      <h3 className="font-heading font-bold text-base text-ink mb-1">Banco de necesidades recibidas</h3>
      <p className="text-xs text-ink-2 mb-4">Visible solo para el super administrador. {items.length} necesidad{items.length === 1 ? '' : 'es'} registrada{items.length === 1 ? '' : 's'}.</p>
      {items.length === 0 ? (
        <p className="text-sm text-ink-2/60 italic">Aún no se han registrado necesidades de empresas.</p>
      ) : (
        <div className="space-y-3">
          {items.map(n => (
            <div key={n._id} className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-magenta">{n.empresa?.nombre}</span>
                {n.empresa?.sector && <span className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-gray-200 text-ink-2">{n.empresa.sector}</span>}
                {n.contexto?.urgencia && <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700">{n.contexto.urgencia}</span>}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-magenta/8 border border-magenta/15 text-magenta-dark">{n.estado || 'nueva'}</span>
              </div>
              <h4 className="font-heading font-semibold text-sm text-ink">{n.reto?.titulo}</h4>
              <p className="text-xs text-ink-2 leading-relaxed mt-1">{n.reto?.problema}</p>
              {n.reto?.resultadoEsperado && (
                <p className="text-[11px] text-ink-2/80 leading-relaxed mt-1"><span className="font-semibold">Resultado esperado:</span> {n.reto.resultadoEsperado}</p>
              )}
              <p className="text-[10px] text-ink-2/50 mt-2">{n.contacto?.nombre} · {n.contacto?.email}{n.contacto?.telefono ? ' · ' + n.contacto.telefono : ''}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

const FORM_INICIAL = {
  empresa: { nombre: '', sector: '', tamano: '', ciudad: '' },
  contacto: { nombre: '', cargo: '', email: '', telefono: '' },
  reto: { titulo: '', problema: '', area: '', situacionActual: '', resultadoEsperado: '', datosDisponibles: '', restricciones: '' },
  contexto: { urgencia: '', impacto: '', plazoNegocio: '', tecnologiasActuales: [], confidencial: false },
  disposicion: { mentoria: false, datosReales: false, vinculacion: false },
  consentimiento: false,
};

export default function VigilanciaPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const isSuperAdmin = user?.rol === 'superadmin';

  const [form, setForm] = useState(FORM_INICIAL);
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const upd = (grupo, campo, valor) => setForm(f => ({ ...f, [grupo]: { ...f[grupo], [campo]: valor } }));
  const toggleHerramienta = (t) => setForm(f => {
    const arr = f.contexto.tecnologiasActuales;
    return { ...f, contexto: { ...f.contexto, tecnologiasActuales: arr.includes(t) ? arr.filter(x => x !== t) : [...arr, t] } };
  });

  async function submit(e) {
    e.preventDefault();
    setError('');
    if (!form.empresa.nombre.trim() || !form.contacto.email.trim() || !form.reto.titulo.trim() || !form.reto.problema.trim()) {
      setError('Complete los campos obligatorios: empresa, correo de contacto, título y descripción del reto.');
      return;
    }
    if (!form.consentimiento) {
      setError('Debe autorizar el tratamiento de los datos (Ley 1581 de 2012) para enviar la necesidad.');
      return;
    }
    setEnviando(true);
    try {
      await necesidadesService.guardar(form);
      setEnviado(true);
    } catch (err) {
      setError(err.message || 'No fue posible enviar la necesidad. Intente de nuevo.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="max-w-[900px] mx-auto space-y-6 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-2 hover:text-magenta transition-colors cursor-pointer"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Volver
      </button>

      {/* Hero */}
      <div className="bg-gradient-to-br from-magenta to-magenta-dark rounded-2xl p-7 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur grid place-items-center">
              <Icono name="antena" className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold tracking-wider uppercase bg-white/15 backdrop-blur px-2.5 py-1 rounded-full">
              Vinculación con el sector productivo
            </span>
          </div>
          <h1 className="font-heading font-bold text-2xl">Vigilancia Tecnológica e Inteligencia Competitiva</h1>
          <p className="text-white/85 text-sm mt-2 max-w-2xl leading-relaxed">
            Un proceso sistemático para captar las necesidades reales de las empresas y convertirlas en retos realizables por los estudiantes del programa. Así se conecta la demanda tecnológica del sector con la formación por proyectos, del mismo modo en que operan los brókeres de innovación de Medellín como Ruta N y Tecnnova.
          </p>
        </div>
      </div>

      {/* Foco de vigilancia (factores críticos) */}
      <section className="bg-white border border-gray-100 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-6 rounded bg-gradient-to-b from-magenta to-magenta-soft" />
          <h2 className="font-heading font-bold text-lg text-ink">Foco de vigilancia</h2>
        </div>
        <p className="text-sm text-ink-2 mb-4 max-w-2xl leading-relaxed">
          Factores críticos que orientan qué necesidades resultan más pertinentes para el programa. Se priorizan los retos que se relacionen con estos enfoques, los de mayor demanda del sector.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
          {FOCO_VIGILANCIA.enfoques.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs font-medium text-ink w-52 shrink-0">{f.nombre}</span>
              <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-magenta-soft to-magenta" style={{ width: `${f.demanda}%` }} />
              </div>
              <span className="text-xs font-bold text-magenta w-9 text-right">{f.demanda}%</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-ink-2/50 italic mt-4">{FOCO_VIGILANCIA.fuente}</p>
      </section>

      {/* Ciclo de vigilancia */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-6 rounded bg-gradient-to-b from-magenta to-magenta-soft" />
          <h2 className="font-heading font-bold text-lg text-ink">El ciclo de vigilancia y cómo lo aborda esta herramienta</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CICLO.map((c, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-9 h-9 rounded-xl bg-magenta/8 text-magenta grid place-items-center shrink-0">
                  <Icono name={c.icono} />
                </div>
                <span className="text-[11px] font-bold text-magenta/70">Fase {i + 1}</span>
              </div>
              <h3 className="font-heading font-bold text-sm text-ink mb-1">{c.titulo}</h3>
              <p className="text-[12px] text-ink-2 leading-relaxed mb-3">{c.detalle}</p>
              <div className="mt-auto flex items-start gap-1.5 bg-magenta/[0.04] border border-magenta/10 rounded-lg p-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-magenta shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-[11px] text-ink-2 leading-relaxed"><span className="font-semibold text-magenta-dark">En esta herramienta:</span> {c.herramienta}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Formulario: banco de necesidades */}
      <section className="bg-white border border-magenta/15 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-magenta to-magenta-soft text-white grid place-items-center shrink-0">
            <Icono name="idea" className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading font-bold text-lg text-ink">Registre una necesidad real</h2>
            <p className="text-sm text-ink-2 leading-relaxed">
              Cuéntenos un problema o reto de su empresa. El equipo de vigilancia lo valorará y, si es viable, lo transformará en un proyecto para los estudiantes del programa. Describa su necesidad de negocio; la valoración técnica y académica la realiza CESDE.
            </p>
          </div>
        </div>

        {enviado ? (
          <div className="text-center py-10">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 grid place-items-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-heading font-bold text-lg text-ink mb-1">¡Necesidad registrada!</h3>
            <p className="text-sm text-ink-2 max-w-md mx-auto leading-relaxed mb-5">
              Gracias por contribuir al banco de retos reales. El equipo de vigilancia tecnológica de CESDE revisará su necesidad y se pondrá en contacto para los próximos pasos.
            </p>
            <button
              onClick={() => { setForm(FORM_INICIAL); setEnviado(false); }}
              className="inline-flex items-center gap-2 rounded-full border border-magenta/20 text-magenta font-heading font-semibold text-sm px-5 py-2.5 hover:bg-magenta/5 transition-all duration-300 cursor-pointer"
            >
              Registrar otra necesidad
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-6">
            {/* La empresa */}
            <fieldset className="space-y-3">
              <legend className="text-[11px] font-bold uppercase tracking-wider text-magenta mb-1">1 · La empresa</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Campo label="Nombre de la empresa" obligatorio>
                  <input className={inputClass} value={form.empresa.nombre} onChange={e => upd('empresa', 'nombre', e.target.value)} placeholder="Ej.: Soluciones Andinas S.A.S." />
                </Campo>
                <Campo label="Ciudad">
                  <input className={inputClass} value={form.empresa.ciudad} onChange={e => upd('empresa', 'ciudad', e.target.value)} placeholder="Ej.: Medellín" />
                </Campo>
                <Campo label="Sector">
                  <select className={inputClass + ' cursor-pointer'} value={form.empresa.sector} onChange={e => upd('empresa', 'sector', e.target.value)}>
                    <option value="">Seleccione…</option>
                    {SECTORES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Campo>
                <Campo label="Tamaño">
                  <select className={inputClass + ' cursor-pointer'} value={form.empresa.tamano} onChange={e => upd('empresa', 'tamano', e.target.value)}>
                    <option value="">Seleccione…</option>
                    {TAMANOS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </Campo>
              </div>
            </fieldset>

            {/* Contacto */}
            <fieldset className="space-y-3">
              <legend className="text-[11px] font-bold uppercase tracking-wider text-magenta mb-1">2 · Contacto</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Campo label="Nombre del contacto">
                  <input className={inputClass} value={form.contacto.nombre} onChange={e => upd('contacto', 'nombre', e.target.value)} placeholder="Nombre y apellido" />
                </Campo>
                <Campo label="Cargo">
                  <input className={inputClass} value={form.contacto.cargo} onChange={e => upd('contacto', 'cargo', e.target.value)} placeholder="Ej.: Líder de tecnología" />
                </Campo>
                <Campo label="Correo electrónico" obligatorio>
                  <input type="email" className={inputClass} value={form.contacto.email} onChange={e => upd('contacto', 'email', e.target.value)} placeholder="nombre@empresa.com" />
                </Campo>
                <Campo label="Teléfono">
                  <input className={inputClass} value={form.contacto.telefono} onChange={e => upd('contacto', 'telefono', e.target.value)} placeholder="Opcional" />
                </Campo>
              </div>
            </fieldset>

            {/* El reto */}
            <fieldset className="space-y-3">
              <legend className="text-[11px] font-bold uppercase tracking-wider text-magenta mb-1">3 · La necesidad o reto</legend>
              <Campo label="Título del reto" obligatorio>
                <input className={inputClass} value={form.reto.titulo} onChange={e => upd('reto', 'titulo', e.target.value)} placeholder="Resuma la necesidad en una frase" />
              </Campo>
              <Campo label="Descripción del problema" obligatorio>
                <textarea rows={3} className={inputClass + ' resize-y'} value={form.reto.problema} onChange={e => upd('reto', 'problema', e.target.value)} placeholder="¿Qué problema o necesidad tiene la empresa? ¿A quién afecta?" />
              </Campo>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Campo label="Área o tema">
                  <input className={inputClass} value={form.reto.area} onChange={e => upd('reto', 'area', e.target.value)} placeholder="Ej.: gestión de inventario, atención al cliente…" />
                </Campo>
                <Campo label="Situación actual">
                  <input className={inputClass} value={form.reto.situacionActual} onChange={e => upd('reto', 'situacionActual', e.target.value)} placeholder="¿Cómo lo resuelven hoy?" />
                </Campo>
              </div>
              <Campo label="Resultado esperado o entregable">
                <textarea rows={2} className={inputClass + ' resize-y'} value={form.reto.resultadoEsperado} onChange={e => upd('reto', 'resultadoEsperado', e.target.value)} placeholder="¿Qué le gustaría obtener? Ej.: un prototipo web, un tablero de datos, una automatización…" />
              </Campo>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Campo label="Datos o accesos disponibles">
                  <input className={inputClass} value={form.reto.datosDisponibles} onChange={e => upd('reto', 'datosDisponibles', e.target.value)} placeholder="¿Puede compartir datos, ejemplos o accesos?" />
                </Campo>
                <Campo label="Restricciones">
                  <input className={inputClass} value={form.reto.restricciones} onChange={e => upd('reto', 'restricciones', e.target.value)} placeholder="Legales, técnicas, de tiempo…" />
                </Campo>
              </div>
            </fieldset>

            {/* Criticidad y contexto de negocio */}
            <fieldset className="space-y-3">
              <legend className="text-[11px] font-bold uppercase tracking-wider text-magenta mb-1">4 · Criticidad y contexto de negocio</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Campo label="Urgencia">
                  <select className={inputClass + ' cursor-pointer'} value={form.contexto.urgencia} onChange={e => upd('contexto', 'urgencia', e.target.value)}>
                    <option value="">Seleccione…</option>
                    {URGENCIAS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                </Campo>
                <Campo label="Plazo de negocio">
                  <input className={inputClass} value={form.contexto.plazoNegocio} onChange={e => upd('contexto', 'plazoNegocio', e.target.value)} placeholder="¿Para cuándo lo necesitaría? Ej.: en 3 meses" />
                </Campo>
              </div>
              <Campo label="Impacto esperado en el negocio">
                <textarea rows={2} className={inputClass + ' resize-y'} value={form.contexto.impacto} onChange={e => upd('contexto', 'impacto', e.target.value)} placeholder="¿Qué mejora, ahorro o beneficio traería resolver esta necesidad?" />
              </Campo>
              <div>
                <span className="block text-xs font-semibold text-ink mb-2">¿Qué usan hoy para esto? <span className="font-normal text-ink-2/60">(opcional, informativo)</span></span>
                <div className="flex flex-wrap gap-2">
                  {HERRAMIENTAS_ACTUALES.map(t => {
                    const activo = form.contexto.tecnologiasActuales.includes(t);
                    return (
                      <button
                        type="button"
                        key={t}
                        onClick={() => toggleHerramienta(t)}
                        className={`text-[12px] font-medium px-3 py-1.5 rounded-full border transition-all duration-200 cursor-pointer ${activo ? 'bg-magenta text-white border-magenta shadow-sm shadow-magenta/30' : 'bg-white text-ink-2 border-gray-200 hover:border-magenta/40'}`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.contexto.confidencial} onChange={e => upd('contexto', 'confidencial', e.target.checked)} className="w-4 h-4 rounded accent-magenta cursor-pointer" />
                <span className="text-sm text-ink-2">La necesidad requiere acuerdo de confidencialidad</span>
              </label>
            </fieldset>

            {/* Disposición */}
            <fieldset className="space-y-2">
              <legend className="text-[11px] font-bold uppercase tracking-wider text-magenta mb-1">5 · Disposición de la empresa</legend>
              {[
                ['mentoria', 'Ofrece mentoría o acompañamiento al equipo de estudiantes'],
                ['datosReales', 'Puede compartir datos o casos reales para el proyecto'],
                ['vinculacion', 'Está abierta a la vinculación laboral o de práctica de los estudiantes'],
              ].map(([campo, texto]) => (
                <label key={campo} className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={form.disposicion[campo]} onChange={e => upd('disposicion', campo, e.target.checked)} className="w-4 h-4 rounded accent-magenta cursor-pointer" />
                  <span className="text-sm text-ink-2">{texto}</span>
                </label>
              ))}
            </fieldset>

            {/* Consentimiento (Habeas Data) */}
            <div className="rounded-xl bg-mist border border-magenta/10 p-4">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input type="checkbox" checked={form.consentimiento} onChange={e => setForm(f => ({ ...f, consentimiento: e.target.checked }))} className="w-4 h-4 rounded accent-magenta cursor-pointer mt-0.5" />
                <span className="text-[13px] text-ink-2 leading-relaxed">
                  Autorizo a CESDE el tratamiento de los datos suministrados conforme a la Ley 1581 de 2012 (Habeas Data). La información se usará únicamente con fines académicos del programa y para el contacto relacionado con esta necesidad. <span className="text-magenta font-semibold">*</span>
                </span>
              </label>
            </div>

            {error && (
              <p className="text-sm text-red-600 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            )}

            <div className="flex items-center gap-3 pt-1 flex-wrap">
              <button
                type="submit"
                disabled={enviando}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-magenta to-magenta-dark text-white font-heading font-semibold text-sm px-6 py-3 shadow-lg shadow-magenta/25 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer disabled:opacity-70 disabled:cursor-default disabled:hover:scale-100"
              >
                {enviando ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Enviando…
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Enviar necesidad al banco
                  </>
                )}
              </button>
              <span className="text-[11px] text-ink-2/60">Los campos con <span className="text-magenta font-semibold">*</span> son obligatorios.</span>
            </div>
          </form>
        )}
      </section>

      {isSuperAdmin && <BancoAdmin />}
    </div>
  );
}
