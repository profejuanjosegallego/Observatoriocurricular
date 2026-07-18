import { useState, useRef } from 'react';
import { getMateria } from '../data/materias';

const NIVELES = [
  { id: 1, nombre: 'Nivel I · Fundamentos', perfil: 'El Consultor como Intérprete', modelo: 'Data-First', color: '#6366f1' },
  { id: 2, nombre: 'Nivel II · Construcción', perfil: 'El Arquitecto de Soluciones', modelo: 'Agile-First', color: '#E6007E' },
  { id: 3, nombre: 'Nivel III · Especialización', perfil: 'El Socio Tecnológico', modelo: 'API-First', color: '#10b981' },
];

const NIVEL_MATERIAS = {
  1: ['bd', 'intro', 'logica'],
  2: ['agiles', 'backend1', 'frontend1'],
  3: ['backend2', 'frontend2', 'nuevastec'],
};

const NIVEL_COLORS = {
  1: { bg: 'from-indigo-500 to-indigo-600', accent: '#6366f1', light: 'bg-indigo-50', border: 'border-indigo-200' },
  2: { bg: 'from-magenta to-magenta-dark', accent: '#E6007E', light: 'bg-magenta/5', border: 'border-magenta/15' },
  3: { bg: 'from-emerald-500 to-emerald-600', accent: '#10b981', light: 'bg-emerald-50', border: 'border-emerald-200' },
};

const IDEAS_EJEMPLO = [
  'Plataforma de gestión de alimentos para restaurantes',
  'Sistema de reservas para un coworking',
  'Directorio de servicios para mascotas',
  'Control de inventario para una tienda de barrio',
  'Plataforma de turnos médicos para una IPS',
  'Catálogo de productos para un emprendimiento local',
];

async function generarProyecto(idea, nivel, modeloDatos) {
  const res = await fetch('/api/generador', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea, nivel, tipo: 'proyecto', modeloDatos }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al generar el proyecto');
  return data;
}

const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Contexto compacto para la llamada de didácticas: reenviar el texto completo del proyecto duplica
// tokens y dispara el límite acumulado por minuto de Groq. Con el resumen basta para proponer las semanas.
function contextoParaDidacticas(p) {
  const hitos = (p.avances || []).map((av, i) => {
    const ents = Object.entries(av.porMateria || {})
      .map(([mid, e]) => `${mid}: ${e.titulo} — ${String(e.detalle || '').slice(0, 160)}`)
      .join(' / ');
    return `Avance ${i + 1} (Semana ${av.semana} — ${av.nombre}): ${ents}`;
  }).join('\n');
  return `TITULO: ${p.titulo}
OBJETIVO: ${p.objetivo}
CONCEPTO: ${p.concepto}
HITOS DE ENTREGA:
${hitos}
INTEGRACION: ${p.integracion}`;
}

// Exporta el proyecto integrador (con modelo de datos y didácticas) a PDF mediante la ventana de impresión del navegador.
function imprimirProyectoPDF(proyecto, didacticas, nivel) {
  const accent = NIVEL_COLORS[nivel].accent;
  const nivelNombre = NIVELES.find(n => n.id === nivel)?.nombre || `Nivel ${nivel}`;
  const materiasNombres = NIVEL_MATERIAS[nivel].map(mid => getMateria(mid)?.nombre || mid).join(' · ');

  const rolesHtml = `
    <div class="rol lider">
      <p class="rolrol">★ ${esc(proyecto.liderRol)} <span class="badge">Líder</span></p>
      <p class="rolmat">${esc(getMateria(proyecto.lider)?.nombre || proyecto.lider)}</p>
      <p class="roldesc">${esc(proyecto.liderRazon)}</p>
    </div>
    ${(proyecto.apoyo || []).map(a => `
    <div class="rol">
      <p class="rolrol">● ${esc(a.rol)}</p>
      <p class="rolmat">${esc(getMateria(a.materia)?.nombre || a.materia)}</p>
      <p class="roldesc">${esc(a.descripcion)}</p>
    </div>`).join('')}`;

  const md = proyecto.modeloDatos;
  const modeloHtml = md ? `
    <h2>Modelo de datos</h2>
    <table><thead><tr><th>Entidad</th><th>Atributos</th></tr></thead><tbody>
      ${(md.entidades || []).map(e => `<tr>
        <td class="ent">${esc(e.nombre)}</td>
        <td><ul>${(e.atributos || []).map(a => `<li>${esc(a)}</li>`).join('')}</ul></td>
      </tr>`).join('')}
    </tbody></table>
    ${(md.relaciones || []).length ? `<p class="subh">Relaciones</p><ul>${md.relaciones.map(r => `<li>${esc(r)}</li>`).join('')}</ul>` : ''}` : '';

  const avancesHtml = (proyecto.avances || []).map((av, idx) => `
    <div class="avance">
      <p class="avtit"><span class="avbadge">Avance ${idx + 1}</span> Semana ${esc(av.semana)} — ${esc(av.nombre)}</p>
      ${Object.entries(av.porMateria || {}).map(([mid, ent]) => `
        <div class="ent-item">
          <p class="entmat">${esc(getMateria(mid)?.nombre || mid)}</p>
          <p class="enttit">${esc(ent.titulo)}</p>
          <p class="entdet">${esc(ent.detalle)}</p>
        </div>`).join('')}
    </div>`).join('');

  const didHtml = (didacticas && Object.keys(didacticas).length)
    ? `<h2>Propuesta didáctica semanal</h2>${NIVEL_MATERIAS[nivel].map(mid => {
        const sem = didacticas[mid] || [];
        if (!sem.length) return '';
        return `<h3>${esc(getMateria(mid)?.nombre || mid)}</h3>
        <table><thead><tr><th class="sem">Sem.</th><th>Tema de clase</th><th>Actividad del proyecto</th></tr></thead><tbody>
          ${sem.map(s => `<tr><td class="sem">${esc(s.semana)}</td><td>${esc(s.tema)}</td><td>${esc(s.actividad)}</td></tr>`).join('')}
        </tbody></table>`;
      }).join('')}`
    : '';

  const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="utf-8"><title>${esc(proyecto.titulo)}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1c1622; margin: 0; padding: 32px 36px; font-size: 12px; line-height: 1.5; }
  .head { border-bottom: 3px solid ${accent}; padding-bottom: 14px; margin-bottom: 20px; }
  .kicker { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: ${accent}; margin: 0; }
  h1 { font-size: 20px; margin: 6px 0 4px; }
  .meta { font-size: 11px; color: #6b6472; margin: 0; }
  .obj { background: ${accent}0d; border-left: 4px solid ${accent}; padding: 10px 14px; border-radius: 0 6px 6px 0; margin: 14px 0; }
  h2 { font-size: 13px; color: ${accent}; margin: 22px 0 8px; border-bottom: 1px solid #eee; padding-bottom: 4px; }
  h3 { font-size: 12px; margin: 14px 0 4px; }
  .subh { font-weight: 700; margin: 12px 0 4px; }
  table { width: 100%; border-collapse: collapse; margin-top: 6px; }
  th { background: ${accent}; color: #fff; font-size: 10px; text-transform: uppercase; letter-spacing: .5px; padding: 7px 9px; text-align: left; }
  td { border: 1px solid #e5e1e8; padding: 8px 9px; vertical-align: top; }
  ul { margin: 4px 0 0; padding-left: 16px; }
  li { margin-bottom: 3px; }
  .ent { font-weight: 600; width: 22%; color: ${accent}; }
  .sem { white-space: nowrap; width: 44px; text-align: center; font-weight: 600; color: ${accent}; }
  .rol { border: 1px solid #e5e1e8; border-radius: 6px; padding: 8px 10px; margin-bottom: 6px; }
  .rol.lider { border-left: 4px solid ${accent}; background: ${accent}08; }
  .rolrol { font-weight: 700; color: ${accent}; margin: 0 0 2px; font-size: 11px; }
  .rolmat { font-weight: 600; margin: 0; }
  .roldesc { color: #6b6472; margin: 2px 0 0; }
  .badge { background: ${accent}; color: #fff; border-radius: 10px; padding: 1px 7px; font-size: 9px; }
  .avance { border: 1px solid #e5e1e8; border-radius: 6px; padding: 10px 12px; margin-bottom: 8px; }
  .avtit { font-weight: 600; margin: 0 0 6px; }
  .avbadge { background: ${accent}12; color: ${accent}; border-radius: 10px; padding: 1px 8px; font-size: 10px; font-weight: 700; }
  .ent-item { background: #faf9fb; border-radius: 5px; padding: 6px 8px; margin-top: 5px; }
  .entmat { font-size: 10px; font-weight: 600; color: ${accent}; margin: 0; }
  .enttit { font-weight: 600; margin: 1px 0 0; }
  .entdet { color: #6b6472; margin: 1px 0 0; }
  .foot { margin-top: 28px; border-top: 1px solid #eee; padding-top: 10px; font-size: 9px; color: #9a93a3; }
  @media print { body { padding: 0; } h2, h3 { page-break-after: avoid; } tr, .avance, .rol { page-break-inside: avoid; } }
</style></head>
<body onload="window.print()">
  <div class="head">
    <p class="kicker">CESDE · Proyecto integrador · ${esc(nivelNombre)}</p>
    <h1>${esc(proyecto.titulo)}</h1>
    <p class="meta">Modelo ${esc(proyecto.modelo)} · Materias: ${esc(materiasNombres)}</p>
  </div>
  <p>${esc(proyecto.descripcion)}</p>
  <div class="obj"><strong>Objetivo integrador.</strong> ${esc(proyecto.objetivo)}</div>
  <p><strong>${esc(proyecto.concepto)}.</strong> ${esc(proyecto.conceptoDetalle)}</p>

  <h2>Roles de los módulos</h2>
  ${rolesHtml}
  ${modeloHtml}

  <h2>Hitos de entrega</h2>
  ${avancesHtml}

  <h2>Mecanismo de integración</h2>
  <p>${esc(proyecto.integracion)}</p>

  ${didHtml}

  <p class="foot">Propuesta generada con inteligencia artificial a partir de la idea central. El docente debe revisarla y validarla antes de aplicarla. Observatorio Curricular — CESDE.</p>
</body></html>`;

  const win = window.open('', '_blank');
  if (!win) {
    alert('El navegador bloqueó la ventana emergente. Permita las ventanas emergentes para descargar el PDF.');
    return;
  }
  win.document.write(html);
  win.document.close();
}

async function generarDidacticas(idea, nivel, contextoProyecto) {
  const res = await fetch('/api/generador', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idea, nivel, tipo: 'didacticas', contextoProyecto }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al generar las didácticas');
  return data;
}

function ProyectoResult({ proyecto, nivel }) {
  const colors = NIVEL_COLORS[nivel];
  const materias = NIVEL_MATERIAS[nivel];
  const liderMateria = getMateria(proyecto.lider);

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
              Modelo {proyecto.modelo}
            </span>
          </div>
          <h3 className="font-heading font-bold text-xl mt-2">{proyecto.titulo}</h3>
          <p className="text-white/80 text-sm mt-2 max-w-2xl leading-relaxed">{proyecto.descripcion}</p>
        </div>
      </div>

      {/* Objetivo */}
      <div className={`${colors.light} border ${colors.border} rounded-xl p-5`}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: colors.accent + '15' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: colors.accent }}>Objetivo integrador</p>
            <p className="text-sm text-ink leading-relaxed">{proyecto.objetivo}</p>
          </div>
        </div>
      </div>

      {/* Concepto central */}
      <div className={`${colors.light} border ${colors.border} rounded-xl p-5`}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: colors.accent + '15' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: colors.accent }}>Concepto central</p>
            <h4 className="font-heading font-bold text-base text-ink mb-1">{proyecto.concepto}</h4>
            <p className="text-sm text-ink-2 leading-relaxed">{proyecto.conceptoDetalle}</p>
          </div>
        </div>
      </div>

      {/* Roles */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h4 className="font-heading font-bold text-sm text-ink mb-3 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Roles de los módulos
        </h4>

        <div className="p-3 rounded-lg mb-3" style={{ backgroundColor: colors.accent + '08', borderLeft: `3px solid ${colors.accent}` }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold" style={{ color: colors.accent }}>★</span>
            <span className="text-xs font-bold" style={{ color: colors.accent }}>{proyecto.liderRol}</span>
            <span className="text-[10px] font-semibold text-white px-1.5 py-0.5 rounded-full" style={{ backgroundColor: colors.accent }}>Líder</span>
          </div>
          <p className="text-sm font-semibold text-ink">{liderMateria?.nombre || proyecto.lider}</p>
          <p className="text-xs text-ink-2 mt-1 leading-relaxed">{proyecto.liderRazon}</p>
        </div>

        <div className="space-y-2">
          {proyecto.apoyo.map((a, i) => {
            const m = getMateria(a.materia);
            return (
              <div key={i} className="p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold" style={{ color: colors.accent }}>●</span>
                  <span className="text-xs font-semibold text-ink-2">{a.rol}</span>
                </div>
                <p className="text-sm font-medium text-ink">{m?.nombre || a.materia}</p>
                <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">{a.descripcion}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modelo de datos (solo Nivel III) */}
      {proyecto.modeloDatos && (
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h4 className="font-heading font-bold text-sm text-ink mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
            </svg>
            Modelo de datos
            <span className="text-[10px] font-semibold text-ink-2/60">
              {proyecto.modeloDatos.entidades.length} entidades
            </span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {proyecto.modeloDatos.entidades.map((e, i) => (
              <div key={i} className="rounded-lg border border-gray-100 overflow-hidden">
                <div className="px-3 py-2 text-xs font-bold text-white" style={{ backgroundColor: colors.accent }}>
                  {e.nombre}
                </div>
                <ul className="divide-y divide-gray-50">
                  {e.atributos.map((a, j) => (
                    <li key={j} className="px-3 py-1.5 text-[11px] text-ink-2 leading-snug">{a}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {proyecto.modeloDatos.relaciones.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: colors.accent }}>Relaciones</p>
              <ul className="space-y-1.5">
                {proyecto.modeloDatos.relaciones.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-ink-2 leading-relaxed">
                    <span className="mt-0.5 shrink-0 font-bold" style={{ color: colors.accent }}>◆</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Avances */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h4 className="font-heading font-bold text-sm text-ink mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Hitos de entrega
        </h4>
        <div className="relative">
          <div className="absolute left-4 top-6 bottom-6 w-0.5" style={{ backgroundColor: colors.accent + '30' }} />
          <div className="space-y-4">
            {proyecto.avances.map((av, idx) => (
              <div key={idx} className="relative pl-10">
                <div
                  className="absolute left-2.5 top-3 w-3 h-3 rounded-full border-2 border-white"
                  style={{ backgroundColor: colors.accent, boxShadow: `0 0 0 3px ${colors.accent}20` }}
                />
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.accent + '12', color: colors.accent }}>
                      Avance {idx + 1}
                    </span>
                    <span className="text-xs font-semibold" style={{ color: colors.accent }}>
                      Semana {av.semana}
                    </span>
                    <span className="text-xs font-medium text-ink-2">— {av.nombre}</span>
                  </div>

                  <div className="space-y-2">
                    {Object.entries(av.porMateria || {}).map(([mid, ent]) => {
                      const m = getMateria(mid);
                      return (
                        <div key={mid} className="rounded-lg p-2.5 bg-white border border-gray-100">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[9px] font-bold" style={{ color: colors.accent }}>●</span>
                            <span className="text-[11px] font-semibold text-ink-2">{m?.nombre || mid}</span>
                          </div>
                          <p className="text-xs font-medium text-ink">{ent.titulo}</p>
                          <p className="text-[11px] text-ink-2 leading-relaxed mt-0.5">{ent.detalle}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Integración */}
      <div className="rounded-xl p-4 border-2 border-dashed" style={{ borderColor: colors.accent + '30', backgroundColor: colors.accent + '05' }}>
        <div className="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 mt-0.5" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-ink mb-1">Mecanismo de integración</p>
            <p className="text-xs text-ink-2 leading-relaxed">{proyecto.integracion}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DidacticasResult({ didacticas, nivel }) {
  const [materiaActiva, setMateriaActiva] = useState(NIVEL_MATERIAS[nivel][0]);
  const colors = NIVEL_COLORS[nivel];
  const semanas = didacticas[materiaActiva] || [];

  const SEMANAS_AVANCE = { 6: 'Avance 1', 12: 'Avance 2', 17: 'Avance 3', 18: 'Bootcamp' };

  return (
    <div className="animate-fade-in">
      {/* Tabs por materia */}
      <div className="flex gap-1 border-b border-gray-200 mb-4 overflow-x-auto">
        {NIVEL_MATERIAS[nivel].map(mid => {
          const m = getMateria(mid);
          const active = mid === materiaActiva;
          return (
            <button
              key={mid}
              onClick={() => setMateriaActiva(mid)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-300 border-b-2 cursor-pointer ${
                active
                  ? 'font-semibold'
                  : 'border-transparent text-ink-2 hover:text-ink'
              }`}
              style={active ? { borderColor: colors.accent, color: colors.accent } : {}}
            >
              {m?.nombre || mid}
            </button>
          );
        })}
      </div>

      {/* Tabla de semanas */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="divide-y divide-gray-100">
          {semanas.map((s) => {
            const esAvance = SEMANAS_AVANCE[s.semana];
            return (
              <div
                key={s.semana}
                className={`flex gap-3 px-4 py-3 ${esAvance ? '' : 'hover:bg-gray-50'} transition-colors`}
                style={esAvance ? { backgroundColor: colors.accent + '08' } : {}}
              >
                <div className="w-9 shrink-0">
                  <span
                    className="inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-bold"
                    style={esAvance
                      ? { backgroundColor: colors.accent, color: '#fff' }
                      : { backgroundColor: colors.accent + '10', color: colors.accent }
                    }
                  >
                    {s.semana}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  {esAvance && (
                    <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-white mb-1 inline-block" style={{ backgroundColor: colors.accent }}>
                      {esAvance}
                    </span>
                  )}
                  <p className={`text-sm ${esAvance ? 'font-semibold text-ink' : 'font-medium text-ink'}`}>
                    {s.tema}
                  </p>
                  <p className="text-xs text-ink-2 leading-relaxed mt-0.5">{s.actividad}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function GeneradorPage() {
  const [idea, setIdea] = useState('');
  const [nivel, setNivel] = useState(1);
  const [numEntidades, setNumEntidades] = useState(5);
  const [minAtr, setMinAtr] = useState(5);
  const [maxAtr, setMaxAtr] = useState(10);
  const [loading, setLoading] = useState(false);
  const [loadingDidacticas, setLoadingDidacticas] = useState(false);
  const [proyecto, setProyecto] = useState(null);
  const [proyectoRaw, setProyectoRaw] = useState('');
  const [alineado, setAlineado] = useState(false);
  const [didacticas, setDidacticas] = useState(null);
  const [error, setError] = useState('');
  const [tokensUsados, setTokensUsados] = useState(null);
  const resultRef = useRef(null);

  async function handleGenerar(e) {
    e.preventDefault();
    if (!idea.trim()) return;
    setError('');
    setProyecto(null);
    setDidacticas(null);
    setTokensUsados(null);
    setAlineado(false);
    setLoading(true);

    try {
      const modeloDatos = nivel === 3
        ? { numEntidades: Number(numEntidades) || 5, minAtr: Number(minAtr) || 5, maxAtr: Number(maxAtr) || 10 }
        : null;
      const res = await generarProyecto(idea.trim(), nivel, modeloDatos);
      setProyecto(res.proyecto);
      setProyectoRaw(res.raw);
      setAlineado(!!res.alineadoPlaneador);
      const t1 = res.usage || {};
      setTokensUsados({ prompt: t1.prompt_tokens || 0, completion: t1.completion_tokens || 0, total: t1.total_tokens || 0 });
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);

      setLoading(false);
      setLoadingDidacticas(true);
      const res2 = await generarDidacticas(idea.trim(), nivel, contextoParaDidacticas(res.proyecto));
      setDidacticas(res2.didacticas);
      const t2 = res2.usage || {};
      setTokensUsados(prev => ({
        prompt: (prev?.prompt || 0) + (t2.prompt_tokens || 0),
        completion: (prev?.completion || 0) + (t2.completion_tokens || 0),
        total: (prev?.total || 0) + (t2.total_tokens || 0),
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingDidacticas(false);
    }
  }

  const nivelInfo = NIVELES.find(n => n.id === nivel);

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-magenta to-magenta-dark flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-heading tracking-tight">Diseño de proyecto integrador asistido por IA</h2>
            <p className="text-sm text-ink-2">A partir de una idea central, la IA genera la estructura del proyecto integrador y una propuesta didáctica semanal alineada al nivel seleccionado.</p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleGenerar} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
        <div className="space-y-5">
          {/* Idea */}
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">
              Idea central del proyecto
            </label>
            <textarea
              value={idea}
              onChange={e => setIdea(e.target.value)}
              placeholder="Ej: Plataforma de gestión de alimentos para restaurantes"
              rows={2}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-magenta focus:ring-2 focus:ring-magenta/10 transition-all resize-none"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {IDEAS_EJEMPLO.map(ej => (
                <button
                  key={ej}
                  type="button"
                  onClick={() => setIdea(ej)}
                  className="text-[10px] px-2.5 py-1 rounded-full border border-gray-200 text-ink-2 hover:border-magenta hover:text-magenta transition-all cursor-pointer"
                >
                  {ej}
                </button>
              ))}
            </div>
          </div>

          {/* Nivel */}
          <div>
            <label className="block text-sm font-semibold text-ink mb-2">
              Nivel del programa
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {NIVELES.map(nv => {
                const selected = nivel === nv.id;
                return (
                  <button
                    key={nv.id}
                    type="button"
                    onClick={() => setNivel(nv.id)}
                    className={`text-left rounded-xl p-4 border-2 transition-all duration-300 cursor-pointer ${
                      selected ? 'scale-[1.02] shadow-md' : 'hover:border-gray-300'
                    }`}
                    style={{
                      borderColor: selected ? nv.color : '#e5e7eb',
                      backgroundColor: selected ? nv.color + '08' : 'transparent',
                    }}
                  >
                    <p className="text-sm font-bold" style={{ color: selected ? nv.color : '#1c1622' }}>{nv.nombre}</p>
                    <p className="text-[11px] text-ink-2 mt-0.5">{nv.perfil}</p>
                    <span className="inline-block text-[9px] font-bold uppercase tracking-wider mt-2 px-2 py-0.5 rounded-full" style={{ backgroundColor: nv.color + '15', color: nv.color }}>
                      {nv.modelo}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modelo de datos (solo Nivel III) */}
          {nivel === 3 && (
            <div className="rounded-xl border-2 p-4" style={{ borderColor: NIVEL_COLORS[3].accent + '30', backgroundColor: NIVEL_COLORS[3].accent + '06' }}>
              <div className="flex items-center gap-2 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" style={{ color: NIVEL_COLORS[3].accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
                <label className="text-sm font-semibold text-ink">Modelo de datos</label>
              </div>
              <p className="text-[11px] text-ink-2 mb-3">Indique cuántas entidades (tablas) debe tener el modelo relacional. La IA diseñará los nombres, los atributos y las relaciones respetando el rango de atributos por entidad.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-ink-2 mb-1">Número de entidades</label>
                  <input
                    type="number" min={1} max={20} value={numEntidades}
                    onChange={e => setNumEntidades(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-magenta focus:ring-2 focus:ring-magenta/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-ink-2 mb-1">Atributos mínimos</label>
                  <input
                    type="number" min={1} max={20} value={minAtr}
                    onChange={e => setMinAtr(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-magenta focus:ring-2 focus:ring-magenta/10 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-ink-2 mb-1">Atributos máximos</label>
                  <input
                    type="number" min={1} max={20} value={maxAtr}
                    onChange={e => setMaxAtr(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-magenta focus:ring-2 focus:ring-magenta/10 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Botón */}
          <button
            type="submit"
            disabled={loading || !idea.trim()}
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-magenta to-magenta-dark text-white font-semibold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-magenta/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Diseñando proyecto integrador...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Diseñar proyecto integrador
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 animate-fade-in">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Resultados */}
      <div ref={resultRef}>
        {/* Proyecto generado */}
        {proyecto && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-5 rounded bg-gradient-to-b from-magenta to-magenta-soft" />
              <h3 className="font-heading font-semibold text-base">Proyecto integrador generado</h3>
              {alineado && (
                <span
                  className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200"
                  title="Los entregables de cada hito se ajustaron a las temáticas reales del planeador de las materias"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Alineado al planeador
                </span>
              )}
              <button
                type="button"
                onClick={() => imprimirProyectoPDF(proyecto, didacticas, nivel)}
                className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold rounded-lg px-3 py-1.5 border border-gray-200 text-ink-2 hover:border-magenta hover:text-magenta transition-all cursor-pointer"
                title="Exporta el proyecto, el modelo de datos y las didácticas a PDF"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Descargar PDF
              </button>
            </div>
            <ProyectoResult proyecto={proyecto} nivel={nivel} />
          </div>
        )}

        {/* Loading didácticas */}
        {loadingDidacticas && (
          <div className="bg-white border border-gray-100 rounded-xl p-8 text-center animate-fade-in mb-8">
            <svg className="animate-spin w-6 h-6 mx-auto mb-3 text-magenta" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm text-ink-2">Generando propuesta didáctica semanal...</p>
          </div>
        )}

        {/* Didácticas generadas */}
        {didacticas && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-5 rounded bg-gradient-to-b from-amber-400 to-orange-400" />
              <h3 className="font-heading font-semibold text-base">Propuesta didáctica semanal</h3>
            </div>
            <p className="text-xs text-ink-2 mb-4">
              Sugerencia de cómo trabajar el proyecto desde las didácticas de clase, semana a semana, para cada materia del nivel.
            </p>
            <DidacticasResult didacticas={didacticas} nivel={nivel} />
          </div>
        )}

        {/* Indicador de tokens usados */}
        {tokensUsados && (
          <div className="mt-6 bg-gray-50 border border-gray-100 rounded-xl p-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-ink-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="text-xs font-semibold text-ink-2">Consumo de IA en esta generación</span>
            </div>
            <div className="flex gap-4 flex-wrap">
              <div className="text-center">
                <p className="text-lg font-bold text-ink">{tokensUsados.total.toLocaleString()}</p>
                <p className="text-[10px] text-ink-2">Tokens totales</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-indigo-500">{tokensUsados.prompt.toLocaleString()}</p>
                <p className="text-[10px] text-ink-2">Entrada</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-500">{tokensUsados.completion.toLocaleString()}</p>
                <p className="text-[10px] text-ink-2">Respuesta</p>
              </div>
              <div className="text-center">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (tokensUsados.total / 12000) * 100)}%`,
                      backgroundColor: tokensUsados.total > 10000 ? '#ef4444' : tokensUsados.total > 7000 ? '#f59e0b' : '#10b981',
                    }}
                  />
                </div>
                <p className="text-[10px] text-ink-2 mt-1">{Math.round((tokensUsados.total / 12000) * 100)}% del límite por minuto</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
