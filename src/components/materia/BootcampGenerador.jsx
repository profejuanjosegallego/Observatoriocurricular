import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getMateria } from '../../data/materias';

const NIVEL_COLORS = {
  1: { bg: 'from-indigo-500 to-indigo-600', accent: '#6366f1' },
  2: { bg: 'from-magenta to-magenta-dark', accent: '#E6007E' },
  3: { bg: 'from-emerald-500 to-emerald-600', accent: '#10b981' },
};

const NIVEL_NOMBRE = {
  1: 'Nivel I · El Consultor como Intérprete',
  2: 'Nivel II · El Arquitecto de Soluciones',
  3: 'Nivel III · El Socio Tecnológico',
};

const RETOS_SUGERIDOS = [
  {
    grupo: 'Problemáticas locales',
    descripcion: 'Retos cercanos al territorio antioqueño y a la realidad de las comunidades.',
    ideas: [
      'Gestión de residuos y reciclaje en las comunas de Medellín',
      'Rutas y tiempos del transporte público en el Valle de Aburrá',
      'Formalización de emprendimientos y comercio de barrio',
      'Turismo rural sostenible en los municipios de Antioquia',
      'Seguimiento de huertas comunitarias y seguridad alimentaria',
      'Atención y reporte de mascotas perdidas en el municipio',
    ],
  },
  {
    grupo: 'Sectores ODS',
    descripcion: 'Retos alineados a los Objetivos de Desarrollo Sostenible.',
    ideas: [
      'ODS 3 · Salud: agendamiento de citas médicas en zonas rurales',
      'ODS 4 · Educación: plataforma de refuerzo escolar para colegios públicos',
      'ODS 6 · Agua: monitoreo del consumo en acueductos veredales',
      'ODS 11 · Ciudades sostenibles: reporte ciudadano de problemas urbanos',
      'ODS 12 · Consumo responsable: trazabilidad de productos de economía local',
      'ODS 13 · Clima: registro de la huella de carbono en instituciones educativas',
    ],
  },
];

async function generarBootcamp(reto, nivel) {
  const res = await fetch('/api/generador', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea: reto, nivel, tipo: 'bootcamp' }),
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error('El servidor devolvió una respuesta no válida. Verifique que el servicio de IA esté disponible e inténtelo de nuevo.');
  }
  if (!res.ok) throw new Error(data.error || `Error ${res.status} al generar el bootcamp`);
  if (!data.bootcamp) throw new Error('La inteligencia artificial no devolvió una agenda. Inténtelo nuevamente.');
  return data;
}

const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function imprimirPDF(bootcamp, nivel) {
  const accent = NIVEL_COLORS[nivel].accent;
  const materias = (bootcamp.materias || []).map(mid => getMateria(mid)?.nombre || mid).join(' · ');

  const agendaHtml = (bootcamp.agenda || []).map(item => `
    <tr>
      <td class="hora">${esc(item.hora)}</td>
      <td>
        <p class="act">${esc(item.actividad)}</p>
        ${item.tematicas?.length ? `<ul>${item.tematicas.map(t => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
      </td>
    </tr>`).join('');

  const compHtml = (bootcamp.competencias || []).map(c => `<li>${esc(c)}</li>`).join('');
  const entHtml = (bootcamp.entregables || []).map(e => `<li>${esc(e)}</li>`).join('');
  const pesoTotal = (bootcamp.rubrica || []).reduce((a, c) => a + (Number(c.peso) || 0), 0);
  const rubHtml = (bootcamp.rubrica || []).map(c => `
    <tr>
      <td class="crit">${esc(c.criterio)}${c.peso != null ? ` <span class="peso">${c.peso}%</span>` : ''}</td>
      <td>${esc(c.superior)}</td>
      <td>${esc(c.aceptable)}</td>
      <td>${esc(c.inicial)}</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><title>${esc(bootcamp.nombre)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1c1622; margin: 0; padding: 32px 36px; font-size: 12px; line-height: 1.5; }
  .head { border-bottom: 3px solid ${accent}; padding-bottom: 14px; margin-bottom: 20px; }
  .kicker { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: ${accent}; margin: 0; }
  h1 { font-size: 20px; margin: 6px 0 4px; }
  .meta { font-size: 11px; color: #6b6472; margin: 0; }
  .obj { background: ${accent}0d; border-left: 4px solid ${accent}; padding: 10px 14px; border-radius: 0 6px 6px 0; margin: 14px 0; }
  h2 { font-size: 13px; color: ${accent}; margin: 22px 0 8px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
  table { width: 100%; border-collapse: collapse; margin-top: 6px; }
  th { background: ${accent}; color: #fff; font-size: 10px; text-transform: uppercase; letter-spacing: .5px; padding: 7px 9px; text-align: left; }
  td { border: 1px solid #e5e1e8; padding: 8px 9px; vertical-align: top; }
  .hora { white-space: nowrap; font-family: 'Consolas', monospace; font-weight: 600; width: 90px; color: ${accent}; }
  .act { font-weight: 600; margin: 0; }
  ul { margin: 6px 0 0; padding-left: 16px; }
  li { margin-bottom: 3px; }
  .crit { font-weight: 600; width: 22%; }
  .peso { background: ${accent}; color: #fff; border-radius: 10px; padding: 1px 7px; font-size: 10px; font-weight: 700; }
  .rub th:first-child { width: 22%; }
  .pesototal { font-size: 11px; color: ${pesoTotal === 100 ? '#15803d' : '#b45309'}; font-weight: 600; margin: 6px 0 0; }
  .foot { margin-top: 28px; border-top: 1px solid #eee; padding-top: 10px; font-size: 9px; color: #9a93a3; }
  @media print { body { padding: 0; } h2 { page-break-after: avoid; } tr { page-break-inside: avoid; } }
</style></head>
<body onload="window.print()">
  <div class="head">
    <p class="kicker">CESDE · Bootcamp · ${esc(NIVEL_NOMBRE[nivel])}</p>
    <h1>${esc(bootcamp.nombre)}</h1>
    <p class="meta">Jornada completa (8:00 – 17:00) · Materias: ${esc(materias)}</p>
  </div>
  <div class="obj"><strong>Objetivo.</strong> ${esc(bootcamp.objetivo)}</div>
  <p><strong>El reto.</strong> ${esc(bootcamp.reto)}</p>

  <h2>Agenda del día</h2>
  <table><thead><tr><th>Hora</th><th>Actividad y temáticas</th></tr></thead><tbody>${agendaHtml}</tbody></table>

  ${compHtml ? `<h2>Competencias que se demuestran</h2><ul>${compHtml}</ul>` : ''}
  ${entHtml ? `<h2>Entregables del reto</h2><ul>${entHtml}</ul>` : ''}

  ${rubHtml ? `<h2>Rúbrica de evaluación</h2>
  <table class="rub"><thead><tr><th>Criterio</th><th>Superior</th><th>Aceptable</th><th>En desarrollo</th></tr></thead><tbody>${rubHtml}</tbody></table>
  <p class="pesototal">Suma de pesos: ${pesoTotal}%</p>` : ''}

  <p class="foot">Propuesta generada con inteligencia artificial a partir del reto seleccionado. El docente debe revisarla y validarla antes de aplicarla. Observatorio Curricular — CESDE.</p>
</body></html>`;

  const win = window.open('', '_blank');
  if (!win) {
    alert('El navegador bloqueó la ventana emergente. Permita las ventanas emergentes para descargar el PDF.');
    return;
  }
  win.document.write(html);
  win.document.close();
}

function AgendaGenerada({ bootcamp, nivel }) {
  const colors = NIVEL_COLORS[nivel];
  const pesoTotal = (bootcamp.rubrica || []).reduce((a, c) => a + (Number(c.peso) || 0), 0);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Hero */}
      <div className={`bg-gradient-to-r ${colors.bg} rounded-2xl p-6 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] font-bold tracking-wider uppercase bg-white/15 backdrop-blur px-2.5 py-1 rounded-full">
              Generado con IA
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase bg-white/15 backdrop-blur px-2.5 py-1 rounded-full">
              Jornada de un día
            </span>
          </div>
          <h3 className="font-heading font-bold text-xl mt-2">{bootcamp.nombre}</h3>
          <p className="text-white/80 text-sm mt-2 max-w-2xl leading-relaxed">{bootcamp.objetivo}</p>
        </div>
      </div>

      {/* Reto */}
      {bootcamp.reto && (
        <div className="border rounded-xl p-5" style={{ backgroundColor: colors.accent + '08', borderColor: colors.accent + '20' }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: colors.accent + '15' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: colors.accent }}>El reto</p>
              <p className="text-sm text-ink-2 leading-relaxed">{bootcamp.reto}</p>
            </div>
          </div>
        </div>
      )}

      {/* Agenda del día */}
      {bootcamp.agenda?.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h4 className="font-heading font-bold text-sm text-ink mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Agenda del día
          </h4>
          <div className="relative">
            <div className="absolute left-[52px] top-3 bottom-3 w-0.5" style={{ backgroundColor: colors.accent + '20' }} />
            <div className="space-y-3">
              {bootcamp.agenda.map((item, i) => {
                const low = item.actividad.toLowerCase();
                const isBreak = low.includes('almuerzo');
                const isDemo = low.includes('sustentación') || low.includes('demo') || low.includes('review') || low.includes('cierre');
                return (
                  <div key={i} className="flex items-start gap-3 relative">
                    <span className="text-[11px] font-mono font-semibold text-ink-2 w-[44px] shrink-0 text-right pt-2.5">
                      {item.hora.split('–')[0].trim()}
                    </span>
                    <div
                      className="absolute left-[50px] top-3 w-2 h-2 rounded-full border-2 border-white z-10"
                      style={{ backgroundColor: isDemo ? '#f59e0b' : isBreak ? '#9ca3af' : colors.accent }}
                    />
                    <div className={`flex-1 rounded-lg p-3 ml-4 ${
                      isDemo ? 'bg-amber-50 border border-amber-200/50' : isBreak ? 'bg-gray-50' : 'bg-gray-50/50'
                    }`}>
                      <p className={`text-sm font-medium ${isDemo ? 'font-semibold text-amber-800' : isBreak ? 'text-ink-2' : 'text-ink'}`}>
                        {item.actividad}
                      </p>
                      <p className="text-[10px] text-ink-2/60 mt-0.5">{item.hora}</p>
                      {item.tematicas?.length > 0 && (
                        <ul className="mt-2 space-y-1">
                          {item.tematicas.map((t, j) => (
                            <li key={j} className="flex items-start gap-1.5 text-xs text-ink-2 leading-relaxed">
                              <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full" style={{ backgroundColor: colors.accent + '80' }} />
                              <span>{t}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Competencias */}
      {bootcamp.competencias?.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h4 className="font-heading font-bold text-sm text-ink mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Competencias que se demuestran
          </h4>
          <div className="space-y-2">
            {bootcamp.competencias.map((comp, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: colors.accent }}>
                  {i + 1}
                </div>
                <p className="text-sm text-ink-2 leading-relaxed">{comp}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Entregables */}
      {bootcamp.entregables?.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h4 className="font-heading font-bold text-sm text-ink mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Entregables del reto
          </h4>
          <ul className="space-y-2">
            {bootcamp.entregables.map((ent, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 shrink-0 mt-0.5" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-ink-2 leading-relaxed">{ent}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Rúbrica de evaluación */}
      {bootcamp.rubrica?.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
            <h4 className="font-heading font-bold text-sm text-ink flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Rúbrica de evaluación
            </h4>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: pesoTotal === 100 ? colors.accent + '15' : '#fef3c7', color: pesoTotal === 100 ? colors.accent : '#b45309' }}>
              Suma de pesos: {pesoTotal}%
            </span>
          </div>
          <div className="space-y-3">
            {bootcamp.rubrica.map((c, i) => (
              <div key={i} className="rounded-lg border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between gap-2 px-3 py-2" style={{ backgroundColor: colors.accent + '0a' }}>
                  <p className="text-sm font-semibold text-ink">{c.criterio}</p>
                  {c.peso != null && (
                    <span className="text-[11px] font-bold text-white px-2 py-0.5 rounded-full shrink-0" style={{ backgroundColor: colors.accent }}>{c.peso}%</span>
                  )}
                </div>
                <div className="grid sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                  <div className="p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 mb-1">Superior</p>
                    <p className="text-xs text-ink-2 leading-relaxed">{c.superior}</p>
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 mb-1">Aceptable</p>
                    <p className="text-xs text-ink-2 leading-relaxed">{c.aceptable}</p>
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-rose-500 mb-1">En desarrollo</p>
                    <p className="text-xs text-ink-2 leading-relaxed">{c.inicial}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Materias del nivel */}
      <div className="flex flex-wrap gap-2">
        {bootcamp.materias?.map(mid => {
          const m = getMateria(mid);
          return (
            <span key={mid} className="text-[10px] font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: colors.accent + '12', color: colors.accent }}>
              {m?.nombre || mid}
            </span>
          );
        })}
      </div>

      {/* Aviso */}
      <div className="rounded-xl p-3 bg-amber-50 border border-amber-200/60">
        <p className="text-[11px] text-amber-800 leading-relaxed">
          Esta es una propuesta generada por inteligencia artificial a partir del reto seleccionado. El docente debe revisarla, ajustarla a la realidad de la empresa invitada y validarla antes de aplicarla.
        </p>
      </div>
    </div>
  );
}

export default function BootcampGenerador({ nivel, open, onClose }) {
  const [reto, setReto] = useState('');
  const [loading, setLoading] = useState(false);
  const [bootcamp, setBootcamp] = useState(null);
  const [error, setError] = useState('');
  const [tokens, setTokens] = useState(null);
  const resultRef = useRef(null);
  const colors = NIVEL_COLORS[nivel];

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    if (open) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  async function handleGenerar(e) {
    e.preventDefault();
    if (!reto.trim()) return;
    setError('');
    setBootcamp(null);
    setTokens(null);
    setLoading(true);
    try {
      const res = await generarBootcamp(reto.trim(), nivel);
      setBootcamp(res.bootcamp);
      const u = res.usage || {};
      setTokens({ prompt: u.prompt_tokens || 0, completion: u.completion_tokens || 0, total: u.total_tokens || 0 });
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col relative"
        onClick={e => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="shrink-0 flex items-start justify-between gap-4 p-6 border-b border-gray-100 bg-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white" style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}cc)` }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-ink tracking-tight">Generar bootcamp con IA</h3>
              <p className="text-xs text-ink-2">{NIVEL_NOMBRE[nivel]}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-2 hover:bg-gray-100 hover:text-ink transition-colors cursor-pointer shrink-0"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cuerpo */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <p className="text-sm text-ink-2 leading-relaxed">
            Seleccione un reto sugerido o describa uno propio. La inteligencia artificial diseñará una agenda completa de un día para el bootcamp de cierre del nivel, aplicando las capacidades técnicas correspondientes.
          </p>

          <form onSubmit={handleGenerar} className="space-y-5">
            {/* Texto libre */}
            <div>
              <label className="block text-sm font-semibold text-ink mb-2">Reto empresarial del bootcamp</label>
              <textarea
                value={reto}
                onChange={e => setReto(e.target.value)}
                placeholder="Ej: Una cooperativa de reciclaje necesita organizar la recolección de residuos por sectores de la comuna."
                rows={3}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-magenta focus:ring-2 focus:ring-magenta/10 transition-all resize-none"
              />
            </div>

            {/* Retos sugeridos por categoría */}
            <div className="space-y-4">
              {RETOS_SUGERIDOS.map(cat => (
                <div key={cat.grupo}>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-xs font-bold text-ink">{cat.grupo}</span>
                    <span className="text-[10px] text-ink-2">{cat.descripcion}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {cat.ideas.map(idea => {
                      const activo = reto.trim() === idea;
                      return (
                        <button
                          key={idea}
                          type="button"
                          onClick={() => setReto(idea)}
                          className="text-[11px] px-2.5 py-1.5 rounded-full border transition-all cursor-pointer text-left"
                          style={activo
                            ? { borderColor: colors.accent, backgroundColor: colors.accent + '12', color: colors.accent }
                            : { borderColor: '#e5e7eb', color: '#5b5563' }
                          }
                        >
                          {idea}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={loading || !reto.trim()}
              className="w-full sm:w-auto px-8 py-3 rounded-xl text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none cursor-pointer flex items-center justify-center gap-2"
              style={{ background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}cc)` }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Ideando con IA...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generar agenda del bootcamp
                </>
              )}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-fade-in">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Estado de carga */}
          {loading && (
            <div className="rounded-xl p-8 text-center animate-fade-in border" style={{ backgroundColor: colors.accent + '06', borderColor: colors.accent + '20' }}>
              <div className="relative w-12 h-12 mx-auto mb-4">
                <svg className="animate-spin w-12 h-12" fill="none" viewBox="0 0 24 24" style={{ color: colors.accent }}>
                  <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 absolute inset-0 m-auto" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-sm font-semibold" style={{ color: colors.accent }}>Ideando con IA...</p>
              <p className="text-xs text-ink-2 mt-1">Diseñando la agenda del bootcamp a partir del reto seleccionado.</p>
            </div>
          )}

          {/* Resultado */}
          <div ref={resultRef}>
            {bootcamp && (
              <div className="pt-2">
                <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-5 rounded" style={{ background: `linear-gradient(to bottom, ${colors.accent}, ${colors.accent}88)` }} />
                    <h4 className="font-heading font-semibold text-base">Agenda generada</h4>
                  </div>
                  <button
                    onClick={() => imprimirPDF(bootcamp, nivel)}
                    className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                    style={{ borderColor: colors.accent, color: colors.accent }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Descargar PDF
                  </button>
                </div>
                <AgendaGenerada bootcamp={bootcamp} nivel={nivel} />
              </div>
            )}

            {/* Tokens */}
            {tokens && (
              <div className="mt-6 bg-gray-50 border border-gray-100 rounded-xl p-4 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-ink-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-xs font-semibold text-ink-2">Consumo de IA en esta generación</span>
                </div>
                <div className="flex gap-4 flex-wrap">
                  <div className="text-center">
                    <p className="text-lg font-bold text-ink">{tokens.total.toLocaleString()}</p>
                    <p className="text-[10px] text-ink-2">Tokens totales</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-indigo-500">{tokens.prompt.toLocaleString()}</p>
                    <p className="text-[10px] text-ink-2">Entrada</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-emerald-500">{tokens.completion.toLocaleString()}</p>
                    <p className="text-[10px] text-ink-2">Respuesta</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
