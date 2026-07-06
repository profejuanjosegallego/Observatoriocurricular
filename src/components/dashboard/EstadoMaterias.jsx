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

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-6 rounded bg-gradient-to-b from-magenta to-magenta-soft" />
        <h3 className="font-heading font-bold text-lg text-ink">Estado de alineación por semestre</h3>
      </div>
      <p className="text-sm text-ink-2 mb-5 max-w-3xl leading-relaxed">
        Panorama del estado actual de cada materia: su perfil de alineación en las cuatro dimensiones —evaluado con IA, igual que en la ficha— y la construcción colaborativa de su relación con el Consultor Tech. Las tres materias de cada semestre se muestran juntas para compararlas de un vistazo.
      </p>

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
