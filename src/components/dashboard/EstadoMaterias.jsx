import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NIVELES, getMateriasPorNivel, MATERIAS } from '../../data/materias';
import { ALINEACION, DIMENSIONES, calcularAlineacion } from '../../data/alineacion';
import { materiasService, alineacionService } from '../../services/api';
import RadarChart from '../materia/RadarChart';

const LABELS = DIMENSIONES.map(d => d.corto);

function promedio(scores) {
  if (!scores || !scores.length) return 0;
  return Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);
}

// Radar a partir del prior experto (rúbrica), instantáneo y sin red.
function baseRadar(materiaId) {
  const a = ALINEACION[materiaId];
  if (!a) return null;
  const scores = DIMENSIONES.map(d => a[d.key] ?? 0);
  return { scores, promedio: promedio(scores), fuente: 'base' };
}

// Radar a partir del puntaje IA-mezclado almacenado en la BD (el mismo que muestra la ficha).
function storedRadar(radar) {
  if (!radar || !DIMENSIONES.every(d => typeof radar[d.key] === 'number')) return null;
  const scores = DIMENSIONES.map(d => radar[d.key]);
  const prom = typeof radar.promedio === 'number' ? radar.promedio : promedio(scores);
  return { scores, promedio: prom, fuente: 'ia' };
}

function MateriaCard({ materia, doc, radar }) {
  const colab = (doc && doc.relacionConsultorTech) || materia.relacionConsultorTech || '';
  const esIA = radar?.fuente === 'ia';

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-1">
        <Link
          to={`/materia/${materia.id}`}
          className="font-heading font-bold text-sm text-ink hover:text-magenta transition-colors leading-snug"
        >
          {materia.nombre}
        </Link>
        <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-magenta bg-magenta/8 border border-magenta/15 rounded-full px-2 py-0.5">
          {radar ? radar.promedio : '—'}
          <span className="text-[8px] font-semibold uppercase tracking-wider text-magenta/70">/100</span>
        </span>
      </div>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-2/45">{materia.modulo}</span>
        <span
          title={esIA ? 'Puntaje evaluado con IA (igual que en la ficha)' : 'Rúbrica base; se actualiza con la evaluación IA al consultar la materia'}
          className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${esIA ? 'bg-magenta/8 text-magenta' : 'bg-gray-100 text-ink-2/50'}`}
        >
          {esIA ? 'IA' : 'base'}
        </span>
      </div>

      {radar ? (
        <RadarChart scores={radar.scores} labels={LABELS} maxWidthClass="max-w-[300px]" />
      ) : (
        <div className="h-40 grid place-items-center text-xs text-ink-2/50">Sin datos de alineación</div>
      )}

      <div className="mt-2 pt-3 border-t border-gray-100 flex-1 flex flex-col">
        <span className="block text-[9px] font-bold uppercase tracking-wider text-magenta mb-1">Construcción colaborativa</span>
        {colab ? (
          <p className="text-[11px] text-ink-2/80 leading-relaxed line-clamp-4">{colab}</p>
        ) : (
          <p className="text-[11px] text-ink-2/50 italic">En construcción — aún sin definición colaborativa registrada.</p>
        )}
        <Link
          to={`/materia/${materia.id}`}
          className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-magenta hover:gap-1.5 transition-all self-start"
        >
          Ver ficha completa
          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default function EstadoMaterias() {
  const [docs, setDocs] = useState({});
  const [radars, setRadars] = useState(() => {
    const init = {};
    MATERIAS.forEach(m => { init[m.id] = baseRadar(m.id); });
    return init;
  });

  useEffect(() => {
    let vivo = true;

    materiasService
      .listar()
      .then(async lista => {
        if (!vivo || !Array.isArray(lista)) return;
        const map = {};
        lista.forEach(m => { map[m.materiaId] = m; });
        setDocs(map);

        // Radar inicial: IA almacenada si existe, si no la rúbrica base.
        const init = {};
        MATERIAS.forEach(m => { init[m.id] = storedRadar(map[m.id]?.alineacionRadar) || baseRadar(m.id); });
        if (vivo) setRadars(init);

        // Autorrelleno: para las materias sin puntaje IA almacenado, se evalúa (cacheado en la BD),
        // se mezcla con el prior experto, se muestra y se guarda para futuras consultas del home.
        for (const m of MATERIAS) {
          if (!vivo) break;
          if (init[m.id]?.fuente === 'ia') continue;
          try {
            const r = await alineacionService.obtener(m.id);
            const sem = r?.semantica || null;
            if (!sem) continue;
            const blended = calcularAlineacion(m.id, sem);
            if (!blended) continue;
            const scores = DIMENSIONES.map(d => blended[d.key] || 0);
            const radar = { promedio: promedio(scores) };
            DIMENSIONES.forEach((d, i) => { radar[d.key] = scores[i]; });
            if (vivo) setRadars(prev => ({ ...prev, [m.id]: { scores, promedio: radar.promedio, fuente: 'ia' } }));
            materiasService.guardar({ materiaId: m.id, alineacionRadar: radar }).catch(() => {});
          } catch { /* se conserva el radar base */ }
        }
      })
      .catch(() => {});

    return () => { vivo = false; };
  }, []);

  // Índice global (promedio de los 9 módulos) y desglose por nivel.
  const NIVEL_COLOR = { 1: '#6366f1', 2: '#E6007E', 3: '#10b981' };
  const resumenNiveles = NIVELES.map(nivel => {
    const materias = getMateriasPorNivel(nivel.nivel);
    const proms = materias.map(m => radars[m.id]?.promedio).filter(v => typeof v === 'number');
    const avg = proms.length ? Math.round(proms.reduce((s, v) => s + v, 0) / proms.length) : 0;
    return { nivel, avg, evaluadas: proms.length, total: materias.length, color: NIVEL_COLOR[nivel.nivel] };
  });
  const promsGlobal = MATERIAS.map(m => radars[m.id]?.promedio).filter(v => typeof v === 'number');
  const globalAvg = promsGlobal.length ? Math.round(promsGlobal.reduce((s, v) => s + v, 0) / promsGlobal.length) : 0;
  const R = 52;
  const CIRC = 2 * Math.PI * R;
  const dashOffset = CIRC * (1 - globalAvg / 100);

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-6 rounded bg-gradient-to-b from-magenta to-magenta-soft" />
        <h3 className="font-heading font-bold text-lg text-ink">Estado de alineación por semestre</h3>
      </div>
      <p className="text-sm text-ink-2 mb-5 max-w-3xl leading-relaxed">
        Panorama del estado actual de cada materia: su perfil de alineación en las cuatro dimensiones —evaluado con IA, igual que en la ficha— y la construcción colaborativa de su relación con el Consultor Tech. Las tres materias de cada semestre se muestran juntas para compararlas de un vistazo.
      </p>

      {/* Índice global de alineación — resumen visual de los 9 módulos */}
      <div className="bg-gradient-to-br from-ink to-[#2a1f30] text-white rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-magenta/10 rounded-full -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-1/4 w-40 h-40 bg-indigo-500/10 rounded-full translate-y-1/2" />
        <div className="relative flex flex-col md:flex-row items-center gap-8">
          {/* Anillo circular */}
          <div className="relative shrink-0" style={{ width: 168, height: 168 }}>
            <svg width="168" height="168" viewBox="0 0 120 120" className="-rotate-90">
              <defs>
                <linearGradient id="ringGlobal" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F65BB0" />
                  <stop offset="100%" stopColor="#E6007E" />
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
              <circle
                cx="60" cy="60" r={R} fill="none" stroke="url(#ringGlobal)" strokeWidth="10"
                strokeLinecap="round" strokeDasharray={CIRC} strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-heading font-extrabold text-4xl leading-none tabular-nums">{globalAvg}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/50 mt-1">/ 100</span>
            </div>
          </div>

          {/* Detalle y desglose por nivel */}
          <div className="flex-1 w-full">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-magenta-soft bg-magenta/15 px-2.5 py-1 rounded-full mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Índice global del programa
            </span>
            <h4 className="font-heading font-bold text-xl text-white tracking-tight mb-5">Alineación global de los 9 módulos</h4>

            <div className="space-y-3">
              {resumenNiveles.map(({ nivel, avg, color }) => (
                <div key={nivel.nivel} className="flex items-center gap-3">
                  <span className="w-16 shrink-0 text-[11px] font-bold text-white/70">{nivel.nombre}</span>
                  <div className="flex-1 h-2.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${avg}%`, backgroundColor: color, transition: 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right font-heading font-bold text-sm text-white tabular-nums">{avg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {NIVELES.map(nivel => {
          const materias = getMateriasPorNivel(nivel.nivel);
          if (!materias.length) return null;
          return (
            <div key={nivel.nivel}>
              <div className="flex items-baseline gap-2 mb-3">
                <h4 className="font-heading font-bold text-sm text-ink">{nivel.nombre}</h4>
                <span className="text-xs text-magenta font-medium">{nivel.bootcamp}</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {materias.map(m => (
                  <MateriaCard key={m.id} materia={m} doc={docs[m.id]} radar={radars[m.id]} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
