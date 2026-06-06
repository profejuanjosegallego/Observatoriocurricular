import { useState, useEffect, useRef } from 'react';
import { getMateria, getNivel } from '../../data/materias';
import { ALINEACION, DIMENSIONES, DIDACTICAS, REFERENCIAS, CONTEXTO_MNC, CONTEXTO_SECTOR, TESTEO_EMPRESARIAL, INFORME_PERTINENCIA, RECOMENDACIONES_PLANEADOR } from '../../data/alineacion';
import { materiasService, alineacionService } from '../../services/api';
import { useUser } from '../../context/UserContext';
import RadarChart from './RadarChart';

// Interpretación legible del nivel de consenso del panel de expertos.
const CONSENSO_TEXTO = {
  '>60 %': 'Más del 60 % del panel de expertos coincide con este diagnóstico.',
  'Unánime': 'La totalidad del panel de expertos coincide con este diagnóstico.',
  'Dividido': 'El panel está dividido: no existe una postura mayoritaria.',
  '~50 %': 'Cerca de la mitad del panel coincide; el consenso es moderado.',
};

// Burbuja informativa reutilizable: se muestra al pasar el mouse y al hacer clic.
function InfoPopover({ children, content, className = '', label, align = 'center', style, bubbleWidth = 'w-64' }) {
  const [open, setOpen] = useState(false);
  const pos = align === 'right'
    ? 'right-0'
    : align === 'left'
      ? 'left-0'
      : 'left-1/2 -translate-x-1/2';
  return (
    <span
      className="relative inline-flex align-middle shrink-0"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button type="button" aria-label={label} onClick={() => setOpen(o => !o)} className={className} style={style}>
        {children}
      </button>
      {open && (
        <span
          role="tooltip"
          className={`absolute ${pos} top-full mt-2 z-30 ${bubbleWidth} bg-ink text-white text-[11px] leading-relaxed font-normal normal-case tracking-normal text-left rounded-xl px-3.5 py-2.5 shadow-xl shadow-ink/25 animate-fade-in`}
        >
          {content}
        </span>
      )}
    </span>
  );
}

function EditableField({ label, value, fieldKey, onSave, wide }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const ref = useRef(null);

  useEffect(() => { setText(value || ''); }, [value]);
  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      ref.current.selectionStart = ref.current.value.length;
    }
  }, [editing]);

  async function save() {
    const trimmed = text.trim();
    if (trimmed === (value || '')) { setEditing(false); return; }
    setSaving(true);
    await onSave(fieldKey, trimmed);
    setSaving(false);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <div className={`bg-white border border-magenta/10 rounded-xl p-4 hover:shadow-md transition-all duration-300 group ${wide ? 'sm:col-span-2' : ''}`}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[0.65rem] tracking-wide uppercase font-bold text-magenta">
          {label}
        </span>
        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-[10px] text-ok font-semibold animate-fade-in">Guardado</span>
          )}
          {!editing && onSave && (
            <button
              onClick={() => setEditing(true)}
              className="opacity-0 group-hover:opacity-100 text-ink-2/30 hover:text-magenta transition-all duration-200 cursor-pointer"
              title="Editar campo"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {editing ? (
        <div className="space-y-2 animate-fade-in">
          <textarea
            ref={ref}
            value={text}
            onChange={e => setText(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 text-sm border border-magenta/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-magenta/20 focus:border-magenta resize-y transition-all duration-200"
            onKeyDown={e => {
              if (e.key === 'Escape') { setText(value || ''); setEditing(false); }
            }}
          />
          <div className="flex items-center gap-2">
            <button
              onClick={save}
              disabled={saving}
              className="px-3 py-1.5 bg-magenta text-white text-xs font-semibold rounded-lg hover:bg-magenta-dark disabled:opacity-40 transition-all duration-200 cursor-pointer"
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
            <button
              onClick={() => { setText(value || ''); setEditing(false); }}
              className="px-3 py-1.5 text-ink-2 text-xs font-medium rounded-lg hover:bg-magenta/5 transition-all duration-200 cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <p
          onClick={() => onSave && setEditing(true)}
          className={`text-sm text-ink-2 leading-relaxed ${onSave ? 'cursor-pointer hover:bg-magenta/[0.03] rounded px-1 -mx-1 transition-colors duration-150' : ''}`}
        >
          {value || <span className="italic text-ink-2/40">Pendiente de registro.</span>}
        </p>
      )}
    </div>
  );
}

function DidacticaCard({ d }) {
  return (
    <div className="bg-white border border-magenta/10 rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
      <h4 className="font-heading font-bold text-sm text-ink mb-1.5">{d.metodo}</h4>
      <p className="text-xs text-ink-2 leading-relaxed mb-2">{d.aplicacion}</p>
      <span className="inline-block text-[10px] font-semibold text-magenta bg-magenta/8 px-2 py-0.5 rounded-full">
        {d.beneficio}
      </span>
    </div>
  );
}

function ReferenciaLink({ r }) {
  return (
    <a
      href={r.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 p-3 rounded-xl border border-magenta/8 bg-white hover:border-magenta/25 hover:shadow-sm transition-all duration-300 group"
    >
      <span className="w-8 h-8 rounded-lg bg-magenta/8 text-magenta grid place-items-center shrink-0 group-hover:bg-magenta/15 transition-colors duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </span>
      <div className="min-w-0">
        <span className="text-sm font-semibold text-ink group-hover:text-magenta transition-colors duration-200 block">
          {r.nombre}
        </span>
        <span className="text-[11px] text-ink-2 leading-snug block mt-0.5">{r.descripcion}</span>
        {r.normativa && (
          <span className="text-[10px] font-semibold text-magenta/60 mt-1 block">{r.normativa}</span>
        )}
      </div>
    </a>
  );
}

function RecCard({ rec, indice, override, canEdit, onEdit, onDelete, onRestore }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [tema, setTema] = useState('');
  const [justificacion, setJustificacion] = useState('');

  if (override?.accion === 'eliminado') {
    return (
      <div className="bg-red-50/50 border border-red-200/30 rounded-xl p-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <span className="text-xs text-red-400 line-through">{rec.tema}</span>
          <p className="text-[10px] text-red-400 italic mt-0.5">
            Eliminada por {override.usuario} · {new Date(override.fecha).toLocaleDateString('es-CO')}
          </p>
        </div>
        {canEdit && (
          <button onClick={() => onRestore(indice)} className="text-[10px] text-amber-700 font-semibold px-2 py-1 rounded-md bg-amber-50 hover:bg-amber-100 cursor-pointer transition-colors shrink-0">
            Restaurar
          </button>
        )}
      </div>
    );
  }

  const displayTema = override?.accion === 'editado' ? override.tema : rec.tema;
  const displayJust = override?.accion === 'editado' ? override.justificacion : rec.justificacion;

  function startEdit() {
    setTema(displayTema);
    setJustificacion(displayJust);
    setEditing(true);
  }

  function saveEdit() {
    if (!tema.trim()) return;
    onEdit(indice, { tema: tema.trim(), justificacion: justificacion.trim() });
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="bg-white border border-amber-300/50 rounded-xl p-4 space-y-2 animate-fade-in">
        <input value={tema} onChange={e => setTema(e.target.value)} className="w-full px-3 py-1.5 text-sm border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200/40" placeholder="Título" />
        <textarea value={justificacion} onChange={e => setJustificacion(e.target.value)} rows={2} className="w-full px-3 py-1.5 text-xs border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-200/40 resize-y" placeholder="Justificación" />
        <div className="flex gap-2">
          <button onClick={saveEdit} className="px-3 py-1 bg-amber-500 text-white text-xs font-semibold rounded-lg hover:bg-amber-600 cursor-pointer transition-colors">Guardar</button>
          <button onClick={() => setEditing(false)} className="px-3 py-1 text-xs text-ink-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">Cancelar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 border border-amber-200/30 rounded-xl p-4 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start gap-3">
        <span className="inline-flex items-center justify-center w-16 h-7 rounded-lg bg-amber-100 text-amber-800 text-[11px] font-bold shrink-0 mt-0.5">
          Sem. {rec.semana}
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="font-heading font-bold text-sm text-ink mb-1">{displayTema}</h4>
          <p className="text-xs text-ink-2 leading-relaxed mb-2">{displayJust}</p>
          <div className="flex flex-wrap items-center gap-1.5">
            {rec.fuentes.map((f, fi) => (
              <span key={fi} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700">
                {f}
              </span>
            ))}
            {override?.accion === 'editado' && (
              <span className="text-[10px] italic text-ink-2/50 ml-1">
                Editada por {override.usuario} · {new Date(override.fecha).toLocaleDateString('es-CO')}
              </span>
            )}
          </div>
        </div>
        {canEdit && !confirming && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button onClick={startEdit} className="text-ink-2/40 hover:text-amber-600 cursor-pointer transition-colors p-1" title="Editar">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button onClick={() => setConfirming(true)} className="text-ink-2/30 hover:text-red-500 cursor-pointer transition-colors p-1" title="Eliminar">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {confirming && (
          <span className="inline-flex items-center gap-1.5 text-[11px] animate-fade-in shrink-0">
            <span className="text-red-500 font-semibold">¿Eliminar?</span>
            <button onClick={() => { onDelete(indice); setConfirming(false); }} className="px-1.5 py-0.5 bg-red-500 text-white rounded font-semibold hover:bg-red-600 cursor-pointer transition-colors">Sí</button>
            <button onClick={() => setConfirming(false)} className="px-1.5 py-0.5 bg-gray-200 text-ink rounded font-semibold hover:bg-gray-300 cursor-pointer transition-colors">No</button>
          </span>
        )}
      </div>
    </div>
  );
}

function SugerenciaDocenteCard({ s, materiaId, canEdit, onSave, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [semana, setSemana] = useState(s.semana || '');
  const [titulo, setTitulo] = useState(s.titulo || '');
  const [descripcion, setDescripcion] = useState(s.descripcion || '');

  function resetCampos() {
    setSemana(s.semana || '');
    setTitulo(s.titulo || '');
    setDescripcion(s.descripcion || '');
  }

  async function save() {
    if (!String(semana).trim() || !titulo.trim()) return;
    setBusy(true);
    await onSave({
      _id: s._id,
      materiaId,
      profesor: s.profesor,
      semana: String(semana).trim(),
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
    });
    setBusy(false);
    setEditing(false);
  }

  async function remove() {
    setBusy(true);
    await onDelete(s._id);
  }

  if (editing) {
    return (
      <div className="bg-white border border-magenta/30 rounded-xl p-4 space-y-2 animate-fade-in">
        <div className="flex gap-2">
          <input value={semana} onChange={e => setSemana(e.target.value)} className="w-24 px-3 py-1.5 text-sm border border-magenta/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-magenta/20" placeholder="Semana" />
          <input value={titulo} onChange={e => setTitulo(e.target.value)} className="flex-1 px-3 py-1.5 text-sm border border-magenta/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-magenta/20" placeholder="Título" />
        </div>
        <textarea value={descripcion} onChange={e => setDescripcion(e.target.value)} rows={2} className="w-full px-3 py-1.5 text-xs border border-magenta/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-magenta/20 resize-y" placeholder="Justificación (opcional)" />
        <div className="flex gap-2">
          <button onClick={save} disabled={busy} className="px-3 py-1 bg-magenta text-white text-xs font-semibold rounded-lg hover:bg-magenta-dark disabled:opacity-40 cursor-pointer transition-colors">{busy ? 'Guardando...' : 'Guardar'}</button>
          <button onClick={() => { setEditing(false); resetCampos(); }} className="px-3 py-1 text-xs text-ink-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors">Cancelar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 border border-amber-200/30 rounded-xl p-4 hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start gap-3">
        <span className="inline-flex items-center justify-center w-16 h-7 rounded-lg bg-magenta/10 text-magenta text-[11px] font-bold shrink-0 mt-0.5">
          Sem. {s.semana}
        </span>
        <div className="min-w-0 flex-1">
          <h4 className="font-heading font-bold text-sm text-ink mb-1">{s.titulo}</h4>
          {s.descripcion && <p className="text-xs text-ink-2 leading-relaxed mb-2">{s.descripcion}</p>}
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-magenta/8 border border-magenta/15 text-magenta">
            {s.profesor}
          </span>
        </div>
        {canEdit && !confirming && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button onClick={() => setEditing(true)} className="text-ink-2/40 hover:text-magenta cursor-pointer transition-colors p-1" title="Editar">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button onClick={() => setConfirming(true)} className="text-ink-2/30 hover:text-red-500 cursor-pointer transition-colors p-1" title="Eliminar">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        {confirming && (
          <span className="inline-flex items-center gap-1.5 text-[11px] animate-fade-in shrink-0">
            <span className="text-red-500 font-semibold">¿Eliminar?</span>
            <button onClick={remove} disabled={busy} className="px-1.5 py-0.5 bg-red-500 text-white rounded font-semibold hover:bg-red-600 disabled:opacity-40 cursor-pointer transition-colors">Sí</button>
            <button onClick={() => setConfirming(false)} className="px-1.5 py-0.5 bg-gray-200 text-ink rounded font-semibold hover:bg-gray-300 cursor-pointer transition-colors">No</button>
          </span>
        )}
      </div>
    </div>
  );
}

function SugerenciasAlineacion({ materiaId, sugerenciasDocentes, recOverrides, canEdit, onEditRec, onDeleteRec, onRestoreRec, onSaveSugerencia, onDeleteSugerencia }) {
  const recs = RECOMENDACIONES_PLANEADOR[materiaId] || [];
  const docentes = sugerenciasDocentes || [];
  if (recs.length === 0 && docentes.length === 0) return null;

  function getOverride(indice) {
    return recOverrides.find(o => o.indice === indice) || null;
  }

  const activeRecs = recs.filter((_, i) => getOverride(i)?.accion !== 'eliminado');
  const deletedRecs = recs.map((r, i) => ({ r, i, o: getOverride(i) })).filter(x => x.o?.accion === 'eliminado');

  return (
    <section className="bg-gradient-to-br from-[#fffbeb] to-[#fef3c7] border border-amber-200/50 rounded-2xl p-5">
      <h3 className="font-heading font-bold text-base text-ink mb-1">
        Sugerencias para aumentar la alineación
      </h3>
      <p className="text-xs text-ink-2 mb-4">
        Ajustes concretos al planeador semanal basados en el testeo empresarial, el informe de pertinencia, el MNC, la estructura didáctica FTCOCU-236 y los aportes de los docentes del programa.
      </p>
      <div className="space-y-3">
        {recs.map((r, i) => {
          const override = getOverride(i);
          if (override?.accion === 'eliminado' && !canEdit) return null;
          return (
            <RecCard
              key={`s-${i}`}
              rec={r}
              indice={i}
              override={override}
              canEdit={canEdit}
              onEdit={onEditRec}
              onDelete={onDeleteRec}
              onRestore={onRestoreRec}
            />
          );
        })}

        {docentes.length > 0 && activeRecs.length > 0 && (
          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-amber-300/30" />
            <span className="text-[10px] font-semibold text-amber-600/70 uppercase tracking-wider">Aportes de docentes</span>
            <div className="flex-1 h-px bg-amber-300/30" />
          </div>
        )}

        {docentes.map(s => (
          <SugerenciaDocenteCard
            key={s._id}
            s={s}
            materiaId={materiaId}
            canEdit={canEdit}
            onSave={onSaveSugerencia}
            onDelete={onDeleteSugerencia}
          />
        ))}
      </div>
    </section>
  );
}

export default function MateriaFicha({ materiaId, materiaData, sugerenciasDocentes = [], recOverrides = [], onEditRec, onDeleteRec, onRestoreRec, onSaveSugerencia, onDeleteSugerencia, onUpdate }) {
  const { user } = useUser();
  const m = getMateria(materiaId);
  const nv = getNivel(m?.nivel);
  if (!m) return null;

  const canEdit = !!user?.nombre;
  const staticAlin = ALINEACION[materiaId];
  const didacticas = DIDACTICAS[materiaId] || [];
  const [showRefs, setShowRefs] = useState(false);
  const [dynamicAlin, setDynamicAlin] = useState(null);
  const [selectedDim, setSelectedDim] = useState(0);

  useEffect(() => {
    let cancelled = false;
    alineacionService.obtener(materiaId)
      .then(data => { if (!cancelled) setDynamicAlin(data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [materiaId, materiaData]);

  const alin = dynamicAlin?.scores || staticAlin;

  const radarScores = DIMENSIONES.map(d => alin?.[d.key] || 0);
  const radarLabels = DIMENSIONES.map(d => d.corto || d.nombre);

  async function handleSave(fieldKey, value) {
    const current = materiaData || {};
    const body = {
      materiaId,
      proposito: current.proposito || m.proposito || '',
      objetivo: current.objetivo || m.objetivo || '',
      competencia: current.competencia || m.competencia || '',
      relacionPerfilEgreso: current.relacionPerfilEgreso || m.relacionPerfilEgreso || '',
      relacionConsultorTech: current.relacionConsultorTech || m.relacionConsultorTech || '',
      [fieldKey]: value,
      editadoPor: user?.nombre || '',
    };
    await materiasService.guardar(body);
    onUpdate?.();
  }

  const editHandler = canEdit ? handleSave : null;

  const getValue = (dbKey, staticKey) =>
    materiaData?.[dbKey] || m[staticKey || dbKey] || '';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Datos institucionales (no editables) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
        <div className="bg-white border border-magenta/10 rounded-xl p-3">
          <span className="text-[0.6rem] tracking-wide uppercase font-bold text-magenta block mb-0.5">Módulo</span>
          <span className="text-sm font-medium text-ink">{m.modulo}</span>
        </div>
        <div className="bg-white border border-magenta/10 rounded-xl p-3">
          <span className="text-[0.6rem] tracking-wide uppercase font-bold text-magenta block mb-0.5">Horas presenciales</span>
          <span className="text-sm font-medium text-ink">{m.horasPresenciales} h</span>
        </div>
        <div className="bg-white border border-magenta/10 rounded-xl p-3">
          <span className="text-[0.6rem] tracking-wide uppercase font-bold text-magenta block mb-0.5">Nivel</span>
          <span className="text-sm font-medium text-ink">{nv?.nombre}</span>
        </div>
        <div className="bg-white border border-magenta/10 rounded-xl p-3">
          <span className="text-[0.6rem] tracking-wide uppercase font-bold text-magenta block mb-0.5">Bootcamp</span>
          <span className="text-sm font-medium text-ink">{m.bootcamp}</span>
        </div>
      </div>

      {/* NCL si aplica */}
      {m.ncl && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-magenta/5 border border-magenta/12 rounded-xl text-sm text-ink-2 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-magenta shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="text-xs"><strong>Norma de Competencia Laboral:</strong> {m.ncl}</span>
        </div>
      )}

      {/* Unidades de aprendizaje */}
      {m.unidades && m.unidades.length > 0 && (
        <div className="bg-white border border-magenta/10 rounded-xl p-4 mb-2">
          <span className="text-[0.65rem] tracking-wide uppercase font-bold text-magenta block mb-2">
            Unidades de aprendizaje
          </span>
          <ol className="space-y-1.5">
            {m.unidades.map((u, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-2">
                <span className="w-5 h-5 rounded-full bg-magenta/10 text-magenta text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {u}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Campos curriculares editables */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <EditableField
          label="Propósito"
          value={getValue('proposito')}
          fieldKey="proposito"
          onSave={editHandler}
          wide
        />
        <EditableField
          label="Objetivo general"
          value={getValue('objetivo')}
          fieldKey="objetivo"
          onSave={editHandler}
          wide
        />
        <EditableField
          label="Competencia principal"
          value={getValue('competencia')}
          fieldKey="competencia"
          onSave={editHandler}
          wide
        />
        <EditableField
          label="Relación con el perfil de egreso"
          value={getValue('relacionPerfilEgreso')}
          fieldKey="relacionPerfilEgreso"
          onSave={editHandler}
        />
        <EditableField
          label="Relación con el Consultor Tech"
          value={getValue('relacionConsultorTech')}
          fieldKey="relacionConsultorTech"
          onSave={editHandler}
        />
      </div>

      <p className="text-xs text-ink-2/60 italic">
        {canEdit
          ? 'Haga clic en cualquier campo para editarlo. Los cambios se persisten automáticamente. Estos campos se ajustarán con IA al guardar la definición desde los aportes.'
          : 'Identifíquese para poder editar los campos de la ficha.'}
      </p>

      {/* Testeo empresarial */}
      {(() => {
        const testeo = TESTEO_EMPRESARIAL.porMateria[materiaId];
        if (!testeo) return null;
        const meta = TESTEO_EMPRESARIAL.meta;
        const totalVotos = testeo.votos.valorado + testeo.votos.menorImpacto + testeo.votos.diferenciador;
        const maxVotos = 6;
        const valorColor = testeo.valoracion === 'alta' ? 'text-ok' : testeo.valoracion === 'baja' ? 'text-magenta-dark' : 'text-amber-600';
        const valorBg = testeo.valoracion === 'alta' ? 'bg-ok/10' : testeo.valoracion === 'baja' ? 'bg-magenta-dark/10' : 'bg-amber-100';
        const valorLabel = testeo.valoracion === 'alta' ? 'Alta' : testeo.valoracion === 'baja' ? 'Baja' : 'Media';

        return (
          <section className="bg-gradient-to-br from-[#f0f9ff] to-[#f5f0ff] border border-blue-200/40 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3 mb-1">
              <h3 className="font-heading font-bold text-base text-ink">
                Percepción del sector empresarial
              </h3>
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0 ${valorBg} ${valorColor}`}>
                Valoración: {valorLabel}
              </span>
            </div>
            <p className="text-xs text-ink-2 mb-4">
              {meta.metodologia}{' '}
              <InfoPopover
                align="right"
                label="Ver detalle de la fuente"
                content={meta.fuenteDetalle}
                className="italic font-semibold text-magenta underline decoration-dotted decoration-magenta/40 underline-offset-2 hover:decoration-magenta cursor-pointer transition-colors"
              >
                (Fuente: {meta.fuente})
              </InfoPopover>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Gráfica de votos */}
              <div className="space-y-3">
                <h4 className="text-[0.65rem] tracking-wide uppercase font-bold text-ink-2 mb-2">
                  Resultados del testeo (votos de empresas)
                </h4>
                {[
                  { label: 'Más valorado', value: testeo.votos.valorado, max: maxVotos, color: 'bg-emerald-500' },
                  { label: 'Menor impacto', value: testeo.votos.menorImpacto, max: maxVotos, color: 'bg-amber-400' },
                  { label: 'Diferenciador', value: testeo.votos.diferenciador, max: maxVotos, color: 'bg-blue-500' },
                ].map(bar => (
                  <div key={bar.label} className="flex items-center gap-3">
                    <span className="text-xs text-ink-2 w-28 shrink-0">{bar.label}</span>
                    <div className="flex-1 h-5 bg-white/60 rounded-full overflow-hidden border border-black/5">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ease-out ${bar.color}`}
                        style={{ width: `${(bar.value / bar.max) * 100}%`, minWidth: bar.value > 0 ? '1.5rem' : '0' }}
                      />
                    </div>
                    <span className="text-sm font-bold text-ink w-6 text-right">{bar.value}</span>
                  </div>
                ))}
                <p className="text-[10px] text-ink-2/50 italic mt-1">
                  Escala: 0 a {maxVotos} votos posibles por categoría (8 empresas, máximo 3 votos por empresa)
                </p>
              </div>

              {/* Qué demanda el mercado */}
              <div>
                <h4 className="text-[0.65rem] tracking-wide uppercase font-bold text-ink-2 mb-2">
                  Lo que pide el mercado para este submódulo
                </h4>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {testeo.demandas.map((d, i) => (
                    <span key={i} className="text-[11px] font-medium text-ink bg-white border border-black/8 px-2.5 py-1 rounded-full">
                      {d}
                    </span>
                  ))}
                </div>

                <div className="bg-white/70 border border-black/5 rounded-xl p-3 mt-2">
                  <p className="text-xs text-ink-2 leading-relaxed">{testeo.razon}</p>
                  {testeo.cita && (
                    <p className="text-xs text-ink italic mt-2 border-l-2 border-magenta/30 pl-2.5">
                      {testeo.cita}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Brechas relacionadas */}
            <div className="mt-4 pt-3 border-t border-black/5">
              <h4 className="text-[0.65rem] tracking-wide uppercase font-bold text-ink-2 mb-2">
                Brechas identificadas por las empresas
              </h4>
              <div className="flex flex-wrap gap-2">
                {TESTEO_EMPRESARIAL.brechas.map((b, i) => (
                  <span key={i} className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${
                    b.nivel === 'critica' ? 'bg-red-50 border-red-200 text-red-700' :
                    b.nivel === 'alta' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                    'bg-blue-50 border-blue-200 text-blue-700'
                  }`}>
                    {b.nombre}
                    <span className="ml-1 opacity-60">({b.nivel})</span>
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-ink-2/50 italic mt-2">
                {meta.hallazgoClave}
              </p>
            </div>
          </section>
        );
      })()}

      {/* Informe de pertinencia — Panel de expertos */}
      {(() => {
        const pert = INFORME_PERTINENCIA.porMateria[materiaId];
        if (!pert) return null;
        const meta = INFORME_PERTINENCIA.meta;
        const semaforoConfig = {
          verde: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-500', label: 'Prioritario', glow: 'rgba(16, 185, 129, 0.22)', explica: 'Eje vigente y prioritario: se conserva y se refuerza en el currículo.' },
          amarillo: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', dot: 'bg-amber-400', label: 'Capacitación en puesto', glow: 'rgba(245, 158, 11, 0.22)', explica: 'Pertinente, aunque la empresa suele complementar la formación en el puesto.' },
          rojo: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', dot: 'bg-red-500', label: 'Requiere actualización', glow: 'rgba(239, 68, 68, 0.22)', explica: 'Desactualizado frente a la demanda del sector: requiere ajuste.' },
          debate: { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', dot: 'bg-purple-500', label: 'Zona de debate', glow: 'rgba(168, 85, 247, 0.22)', explica: 'No hay acuerdo entre los expertos sobre su alcance o profundidad.' },
        };
        const sc = semaforoConfig[pert.semaforo] || semaforoConfig.amarillo;

        return (
          <section className="bg-gradient-to-br from-[#f0fdf4] to-[#fefce8] border border-emerald-200/40 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3 mb-1">
              <h3 className="font-heading font-bold text-base text-ink">
                Informe de pertinencia curricular
              </h3>
              <InfoPopover
                align="right"
                label="Cómo interpretar el consenso"
                style={{ '--glow-color': sc.glow }}
                className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full cursor-help animate-glow ${sc.bg} ${sc.text} border ${sc.border}`}
                content={
                  <>
                    <strong className="block text-white mb-0.5">{sc.label}</strong>
                    <span className="block mb-2 text-white/80">{sc.explica}</span>
                    <strong className="block text-white mb-0.5">Consenso: {pert.consenso}</strong>
                    <span className="block text-white/80">
                      {CONSENSO_TEXTO[pert.consenso] || 'Nivel de acuerdo del panel de expertos sobre el diagnóstico.'}
                    </span>
                  </>
                }
              >
                <span className={`w-2 h-2 rounded-full ${sc.dot}`} />
                {sc.label} · Consenso: {pert.consenso}
              </InfoPopover>
            </div>
            <p className="text-xs text-ink-2 mb-4">
              {meta.metodologia} <span className="italic text-ink-2/60">Fuente: {meta.fuente}</span>
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Diagnóstico */}
              <div>
                <h4 className="text-[0.65rem] tracking-wide uppercase font-bold text-ink-2 mb-2">
                  Diagnóstico de los expertos
                </h4>
                <div className="bg-white/70 border border-black/5 rounded-xl p-3">
                  <p className="text-xs text-ink-2 leading-relaxed">{pert.diagnostico}</p>
                  {pert.cita && (
                    <p className="text-xs text-ink italic mt-2 border-l-2 border-emerald-400/40 pl-2.5">
                      {pert.cita}
                    </p>
                  )}
                </div>
              </div>

              {/* Recomendaciones */}
              <div>
                <h4 className="text-[0.65rem] tracking-wide uppercase font-bold text-ink-2 mb-2">
                  Ajustes curriculares sugeridos
                </h4>
                <ul className="space-y-1.5">
                  {pert.recomendaciones.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-ink-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} shrink-0 mt-1.5`} />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </section>
        );
      })()}

      {/* Alineación curricular — Radar + Barras */}
      {alin && (
        <section className="bg-gradient-to-br from-magenta/[0.03] to-magenta-soft/[0.05] border border-magenta/10 rounded-2xl p-5">
          <h3 className="font-heading font-bold text-base text-ink mb-1">
            Alineación curricular
          </h3>
          <p className="text-xs text-ink-2 mb-2">
            Estimación basada en tres fuentes: testeo con 8 empresas del sector, panel de 10 expertos de pertinencia curricular y análisis bibliográfico del MNC y la estructura didáctica FTCOCU-236.
          </p>
          {/* Radar grande */}
          <div className="my-4">
            <RadarChart
              scores={radarScores}
              labels={radarLabels}
              highlight={selectedDim}
              maxWidthClass="max-w-[450px]"
              onSelect={setSelectedDim}
            />
          </div>

          <p className="flex items-center justify-center gap-1.5 text-[11px] text-ink-2/60 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 text-magenta/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Seleccione una dimensión para conocer qué mide, por qué aparece y sus fuentes.
          </p>

          {/* Explorador de dimensiones: lista seleccionable + panel de detalle al lado */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {/* Las 5 dimensiones */}
            <div className="space-y-2">
              {DIMENSIONES.map((d, i) => {
                const val = radarScores[i];
                const active = selectedDim === i;
                const barColor = val >= 85 ? 'bg-magenta' : val >= 70 ? 'bg-magenta/70' : 'bg-magenta/40';
                return (
                  <button
                    key={d.key}
                    onClick={() => setSelectedDim(i)}
                    className={`w-full text-left rounded-xl p-2.5 border transition-all duration-200 cursor-pointer ${
                      active ? 'border-magenta/40 bg-magenta/[0.05] shadow-sm' : 'border-transparent hover:bg-magenta/[0.03]'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 ${active ? 'bg-magenta text-white' : 'bg-magenta/10 text-magenta'}`}>
                        {i + 1}
                      </span>
                      <span className={`text-xs ${active ? 'font-bold text-ink' : 'text-ink-2'}`}>{d.nombre}</span>
                      <span className="ml-auto text-xs font-bold text-magenta">{val}%</span>
                    </div>
                    <div className="h-1.5 bg-magenta/8 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`} style={{ width: `${val}%` }} />
                    </div>
                  </button>
                );
              })}
              <div className="pt-2 border-t border-magenta/10 mt-1 flex items-center justify-between px-2.5">
                <span className="text-xs font-bold text-ink">Promedio general</span>
                <span className="text-sm font-bold text-magenta">
                  {Math.round(radarScores.reduce((a, b) => a + b, 0) / radarScores.length)}%
                </span>
              </div>
            </div>

            {/* Detalle de la dimensión seleccionada */}
            {(() => {
              const d = DIMENSIONES[selectedDim];
              const val = radarScores[selectedDim];
              return (
                <div key={d.key} className="bg-white border border-magenta/15 rounded-xl p-4 shadow-sm animate-fade-in">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-full bg-magenta text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                      {selectedDim + 1}
                    </span>
                    <h4 className="font-heading font-bold text-sm text-ink">{d.nombre}</h4>
                    <span className="ml-auto text-base font-bold text-magenta">{val}%</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="block text-[9px] font-bold uppercase tracking-wider text-magenta mb-1">Qué mide (grado de correspondencia)</span>
                      <p className="text-xs text-ink-2 leading-relaxed">{d.desc}</p>
                    </div>
                    <div>
                      <span className="block text-[9px] font-bold uppercase tracking-wider text-magenta mb-1">Por qué aparece en el gráfico</span>
                      <p className="text-xs text-ink-2 leading-relaxed">{d.porque}</p>
                    </div>
                    {d.calculo && (
                      <div>
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-magenta mb-1">Cómo se calculó</span>
                        <p className="text-xs text-ink-2 leading-relaxed">{d.calculo}</p>
                        {d.factores && (
                          <InfoPopover
                            align="right"
                            bubbleWidth="w-72"
                            label="Ver escala de ponderación"
                            className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-semibold text-magenta hover:text-magenta-dark cursor-pointer transition-colors"
                            content={
                              <>
                                <strong className="block text-white mb-1.5">Escala de ponderación</strong>
                                <span className="block text-white/60 mb-1 text-[9px] uppercase tracking-wider font-bold">Bandas del puntaje</span>
                                <div className="space-y-1 mb-2.5">
                                  {[
                                    { r: '85 – 100', e: 'Muy alto', c: '#E6007E' },
                                    { r: '70 – 84', e: 'Alto', c: '#ff4fb0' },
                                    { r: '0 – 69', e: 'En desarrollo', c: '#f7b8db' },
                                  ].map((b, bi) => (
                                    <span key={bi} className="flex items-center gap-2 text-white/85">
                                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: b.c }} />
                                      <span className="font-semibold w-16">{b.r}</span>
                                      <span className="text-white/70">{b.e}</span>
                                    </span>
                                  ))}
                                </div>
                                <span className="block text-white/60 mb-1 text-[9px] uppercase tracking-wider font-bold">Factores ponderados</span>
                                <div className="space-y-1">
                                  {d.factores.map((f, fi) => (
                                    <span key={fi} className="flex items-center justify-between gap-3 text-white/85">
                                      <span>{f.nombre}</span>
                                      <span className="font-bold shrink-0">{f.peso}%</span>
                                    </span>
                                  ))}
                                </div>
                              </>
                            }
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                            </svg>
                            Ver escala de ponderación
                          </InfoPopover>
                        )}
                      </div>
                    )}
                    <div>
                      <span className="block text-[9px] font-bold uppercase tracking-wider text-magenta mb-1.5">Fuentes de este dato</span>
                      <div className="flex flex-col gap-1.5">
                        {d.fuentes.map((f, fi) => f.url ? (
                          <a
                            key={fi}
                            href={f.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-start gap-1.5 text-[11px] text-magenta hover:text-magenta-dark font-medium group transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0 mt-px" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                            <span className="group-hover:underline">{f.nombre}</span>
                          </a>
                        ) : (
                          <span key={fi} className="inline-flex items-start gap-1.5 text-[11px] text-ink-2/70">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0 mt-px text-ink-2/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>{f.nombre} <span className="text-[9px] text-ink-2/40">(documento interno)</span></span>
                          </span>
                        ))}
                      </div>
                    </div>
                    {d.mejoras && (
                      <div className="bg-magenta/[0.04] border border-magenta/15 rounded-lg p-3">
                        <span className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-magenta mb-1.5">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          </svg>
                          Cómo mejorar este indicador
                        </span>
                        <ul className="space-y-1.5">
                          {d.mejoras.map((m, mi) => (
                            <li key={mi} className="flex items-start gap-1.5 text-[11px] text-ink-2 leading-relaxed">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-magenta shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                              {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

        </section>
      )}

      {/* Sugerencias para el planeador */}
      <SugerenciasAlineacion
        materiaId={materiaId}
        sugerenciasDocentes={sugerenciasDocentes}
        recOverrides={recOverrides}
        canEdit={canEdit}
        onEditRec={onEditRec}
        onDeleteRec={onDeleteRec}
        onRestoreRec={onRestoreRec}
        onSaveSugerencia={onSaveSugerencia}
        onDeleteSugerencia={onDeleteSugerencia}
      />

      {/* Referencias normativas y contexto */}
      <section>
        <button
          onClick={() => setShowRefs(!showRefs)}
          className="flex items-center gap-2 text-sm font-heading font-bold text-ink hover:text-magenta transition-colors duration-200 cursor-pointer mb-3"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 transition-transform duration-300 ${showRefs ? 'rotate-90' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          Referencias normativas y contexto ({REFERENCIAS.length + 2})
        </button>

        {showRefs && (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white border border-magenta/10 rounded-xl p-4">
                <h4 className="text-[0.65rem] tracking-wide uppercase font-bold text-magenta mb-1.5">
                  Marco Nacional de Cualificaciones
                </h4>
                <p className="text-xs text-ink-2 leading-relaxed">{CONTEXTO_MNC.resumen}</p>
                <ul className="mt-2 space-y-1">
                  {CONTEXTO_MNC.descriptores.map((d, i) => (
                    <li key={i} className="text-[11px] text-ink-2/80 pl-3 relative before:content-[''] before:absolute before:left-0 before:top-[6px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-magenta/30">
                      {d}
                    </li>
                  ))}
                </ul>
                <p className="text-[10px] text-ink-2/50 mt-2 italic">Fuente: {CONTEXTO_MNC.fuentes}</p>
              </div>
              <div className="bg-white border border-magenta/10 rounded-xl p-4">
                <h4 className="text-[0.65rem] tracking-wide uppercase font-bold text-magenta mb-1.5">
                  Demanda del sector TI — Medellín
                </h4>
                <p className="text-xs text-ink-2 leading-relaxed">{CONTEXTO_SECTOR.resumen}</p>
                <p className="text-[10px] text-ink-2/50 mt-2 italic">Fuentes: {CONTEXTO_SECTOR.fuentes}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {REFERENCIAS.map((r, i) => (
                <ReferenciaLink key={i} r={r} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Recomendaciones didácticas */}
      {didacticas.length > 0 && (
        <section>
          <h3 className="font-heading font-bold text-base text-ink mb-1">
            Didácticas Consultor Tech
          </h3>
          <p className="text-xs text-ink-2 mb-4">
            Estrategias de aula alineadas con la iniciativa Consultor Tech: cada actividad forma no solo la competencia técnica sino la capacidad de interpretar, diseñar o asesorar según el nivel del bootcamp.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {didacticas.map((d, i) => (
              <DidacticaCard key={i} d={d} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
