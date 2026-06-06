import { useState, useEffect, useRef } from 'react';
import { planeadoresService, comentariosService } from '../../services/api';
import { useUser } from '../../context/UserContext';
import { SkeletonRows } from '../common/LoadingSpinner';
import { TITULOS_SESION } from '../../data/titulos-sesion';

function parseTematicas(sem) {
  if (Array.isArray(sem.tematicasDetalle) && sem.tematicasDetalle.length > 0) {
    return sem.tematicasDetalle;
  }
  if (!sem.tematicas) return [];
  return sem.tematicas
    .split(/[\n\r]+/)
    .map(t => t.replace(/^[\s•\-–—·]+/, '').trim())
    .filter(Boolean)
    .map(texto => ({ texto, editadoPor: null, editadoEn: null }));
}

function cleanUnidad(text) {
  if (!text) return 'Sin unidad asignada';
  return text.replace(/^[""\s]+|[""\s]+$/g, '').replace(/[\r\n]+/g, ' — ').trim() || 'Sin unidad asignada';
}

function formatFecha(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
}

const ROL_COLORS = {
  docente: 'bg-blue-100 text-blue-700',
  experto: 'bg-amber-100 text-amber-700',
  coordinador: 'bg-emerald-100 text-emerald-700',
  admin: 'bg-purple-100 text-purple-700',
};

function EditableItem({ item, onSave, onRemove, canEdit }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [text, setText] = useState(item.texto);
  const ref = useRef(null);

  useEffect(() => { setText(item.texto); }, [item.texto]);
  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      ref.current.selectionStart = ref.current.value.length;
    }
  }, [editing]);

  function save() {
    const trimmed = text.trim();
    if (!trimmed) { setConfirming(true); return; }
    if (trimmed !== item.texto) { onSave(trimmed); }
    setEditing(false);
  }

  function confirmRemove() {
    setConfirming(false);
    onRemove();
  }

  if (editing) {
    return (
      <div className="flex items-start gap-2 group">
        <span className="w-1.5 h-1.5 rounded-full bg-magenta mt-2.5 shrink-0" />
        <textarea
          ref={ref}
          value={text}
          onChange={e => setText(e.target.value)}
          onBlur={save}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); save(); }
            if (e.key === 'Escape') { setText(item.texto); setEditing(false); }
          }}
          rows={2}
          className="flex-1 px-2 py-1 text-sm border border-magenta rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-magenta/20 resize-none"
        />
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 group">
      <span className="w-1.5 h-1.5 rounded-full bg-magenta/50 mt-2 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <span
            onClick={() => canEdit && setEditing(true)}
            className={`text-sm text-ink leading-snug ${canEdit ? 'cursor-pointer hover:bg-magenta/5 rounded px-1 -mx-1 transition-colors duration-150' : ''}`}
          >
            {item.texto}
          </span>
          {canEdit && !confirming && (
            <button
              onClick={() => setEditing(true)}
              className="opacity-0 group-hover:opacity-100 text-ink-2/40 hover:text-magenta transition-all duration-150 shrink-0 mt-0.5 cursor-pointer"
              title="Editar temática"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {canEdit && !confirming && (
            <button
              onClick={() => setConfirming(true)}
              className="opacity-0 group-hover:opacity-100 text-ink-2/30 hover:text-red-500 transition-all duration-150 shrink-0 mt-0.5 cursor-pointer"
              title="Eliminar temática"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
          {confirming && (
            <span className="inline-flex items-center gap-1.5 text-[11px] animate-fade-in shrink-0 mt-0.5">
              <span className="text-red-500 font-semibold">¿Eliminar?</span>
              <button onClick={confirmRemove} className="px-1.5 py-0.5 bg-red-500 text-white rounded font-semibold hover:bg-red-600 cursor-pointer transition-colors">Sí</button>
              <button onClick={() => setConfirming(false)} className="px-1.5 py-0.5 bg-gray-200 text-ink rounded font-semibold hover:bg-gray-300 cursor-pointer transition-colors">No</button>
            </span>
          )}
        </div>
        {item.editadoPor && (
          <span className="text-[10px] text-ink-2/50 italic">
            Editado por {item.editadoPor} · {formatFecha(item.editadoEn)}
          </span>
        )}
      </div>
    </div>
  );
}

function EditableResultado({ value, editadoPor, editadoEn, canEdit, onSave }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(value || '');
  const ref = useRef(null);

  useEffect(() => { setText(value || ''); }, [value]);
  useEffect(() => {
    if (editing && ref.current) { ref.current.focus(); }
  }, [editing]);

  function save() {
    const trimmed = text.trim();
    if (trimmed !== (value || '')) { onSave(trimmed); }
    setEditing(false);
  }

  if (!value && !canEdit) return null;

  return (
    <div className="mt-3 ml-11 bg-mist rounded-lg px-3 py-2 group/ra relative">
      <div className="flex items-center gap-2 mb-0.5">
        <p className="text-[10px] font-semibold text-magenta uppercase tracking-wider">
          Resultado de aprendizaje
        </p>
        {canEdit && !editing && (
          <button
            onClick={() => setEditing(true)}
            className="opacity-0 group-hover/ra:opacity-100 text-ink-2/40 hover:text-magenta transition-all duration-150 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
      </div>
      {editing ? (
        <textarea
          ref={ref}
          value={text}
          onChange={e => setText(e.target.value)}
          onBlur={save}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); save(); }
            if (e.key === 'Escape') { setText(value || ''); setEditing(false); }
          }}
          rows={2}
          className="w-full px-2 py-1 text-xs border border-magenta rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-magenta/20 resize-none"
        />
      ) : (
        <p
          onClick={() => canEdit && setEditing(true)}
          className={`text-xs text-ink-2 leading-relaxed ${canEdit ? 'cursor-pointer hover:bg-magenta/5 rounded px-1 -mx-1 transition-colors' : ''}`}
        >
          {value || <span className="italic text-ink-2/40">Sin resultado registrado. Haga clic para agregar.</span>}
        </p>
      )}
      {editadoPor && (
        <p className="text-[10px] text-ink-2/50 italic mt-1">
          Editado por {editadoPor} · {formatFecha(editadoEn)}
        </p>
      )}
    </div>
  );
}

function TituloSesion({ titulo, defaultTitulo, canEdit, onSave }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState('');
  const ref = useRef(null);

  const display = titulo || defaultTitulo;

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      ref.current.selectionStart = ref.current.value.length;
    }
  }, [editing]);

  function startEdit() {
    setText(display);
    setEditing(true);
  }

  function save() {
    const trimmed = text.trim();
    if (trimmed && trimmed !== display) onSave(trimmed);
    setEditing(false);
  }

  if (!display && !canEdit) return null;

  if (editing) {
    return (
      <input
        ref={ref}
        value={text}
        onChange={e => setText(e.target.value)}
        onBlur={save}
        onKeyDown={e => {
          if (e.key === 'Enter') { e.preventDefault(); save(); }
          if (e.key === 'Escape') setEditing(false);
        }}
        className="w-full mt-0.5 px-2 py-0.5 text-xs font-semibold text-ink border border-magenta rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-magenta/20"
      />
    );
  }

  return (
    <p
      onClick={() => canEdit && startEdit()}
      className={`text-[11px] font-semibold text-magenta/70 mt-0.5 leading-tight truncate ${canEdit ? 'cursor-pointer hover:text-magenta transition-colors' : ''}`}
      title={display}
    >
      {display}
    </p>
  );
}

export default function PlaneadorTable({ materiaId }) {
  const { user } = useUser();
  const [semanas, setSemanas] = useState([]);
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [openWeek, setOpenWeek] = useState(null);
  const [textoComentario, setTextoComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [backupInfo, setBackupInfo] = useState(null);
  const [confirmRestore, setConfirmRestore] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const canEdit = !!user?.nombre;

  useEffect(() => {
    setLoading(true);
    setConfirmRestore(false);
    Promise.all([
      planeadoresService.listar(materiaId),
      comentariosService.listar(materiaId).catch(() => []),
      planeadoresService.backupEstado(materiaId).catch(() => ({ existe: false })),
    ])
      .then(([semanasData, comentariosData, backup]) => {
        const filled = Array.from({ length: 18 }, (_, i) => {
          const existing = semanasData.find(d => d.semana === i + 1);
          if (existing) {
            existing._temas = parseTematicas(existing);
            return existing;
          }
          return {
            materiaId, semana: i + 1, unidadAprendizaje: '', tematicas: '',
            HT: 0, HP: 0, HTI: 0, resultadoAprendizaje: '', _temas: [],
          };
        });
        setSemanas(filled);
        setComentarios(comentariosData);
        setBackupInfo(backup);

        if (!backup.existe && semanasData.length > 0) {
          planeadoresService.guardarBackup(materiaId)
            .then(() => planeadoresService.backupEstado(materiaId))
            .then(b => setBackupInfo(b))
            .catch(() => {});
        }
      })
      .catch(() => {
        setSemanas(Array.from({ length: 18 }, (_, i) => ({
          materiaId, semana: i + 1, unidadAprendizaje: '', tematicas: '',
          HT: 0, HP: 0, HTI: 0, resultadoAprendizaje: '', _temas: [],
        })));
      })
      .finally(() => setLoading(false));
  }, [materiaId]);

  async function handleRestore() {
    setRestoring(true);
    try {
      await planeadoresService.restaurarBackup(materiaId);
      const semanasData = await planeadoresService.listar(materiaId);
      const filled = Array.from({ length: 18 }, (_, i) => {
        const existing = semanasData.find(d => d.semana === i + 1);
        if (existing) {
          existing._temas = parseTematicas(existing);
          return existing;
        }
        return {
          materiaId, semana: i + 1, unidadAprendizaje: '', tematicas: '',
          HT: 0, HP: 0, HTI: 0, resultadoAprendizaje: '', _temas: [],
        };
      });
      setSemanas(filled);
    } catch {}
    setRestoring(false);
    setConfirmRestore(false);
  }

  async function guardarSemana(semIdx, updatedTemas, extraFields = {}) {
    const sem = semanas[semIdx];
    const now = new Date().toISOString();
    const payload = {
      materiaId: sem.materiaId,
      semana: sem.semana,
      unidadAprendizaje: sem.unidadAprendizaje,
      HT: sem.HT,
      HP: sem.HP,
      HTI: sem.HTI,
      metodologia: sem.metodologia || '',
      resultadoAprendizaje: sem.resultadoAprendizaje,
      observaciones: sem.observaciones || '',
      editadoPor: user?.nombre || '',
      tematicasDetalle: updatedTemas,
      ...extraFields,
    };

    setSaving(sem.semana);
    try {
      await planeadoresService.guardar(payload);
      setSemanas(prev => prev.map((s, i) => {
        if (i !== semIdx) return s;
        return {
          ...s,
          ...extraFields,
          tematicasDetalle: updatedTemas,
          tematicas: updatedTemas.map(t => t.texto).join('\n'),
          _temas: updatedTemas,
        };
      }));
    } catch {}
    setSaving(null);
  }

  function editarTematica(semIdx, temaIdx, nuevoTexto) {
    const sem = semanas[semIdx];
    const temas = [...sem._temas];
    temas[temaIdx] = {
      texto: nuevoTexto,
      editadoPor: user?.nombre || '',
      editadoEn: new Date().toISOString(),
    };
    guardarSemana(semIdx, temas);
  }

  function eliminarTematica(semIdx, temaIdx) {
    const sem = semanas[semIdx];
    const eliminada = sem._temas[temaIdx];
    const temas = sem._temas.filter((_, i) => i !== temaIdx);
    const prevEliminaciones = sem.eliminaciones || [];
    guardarSemana(semIdx, temas, {
      eliminaciones: [...prevEliminaciones, {
        texto: eliminada.texto,
        eliminadoPor: user?.nombre || '',
        eliminadoEn: new Date().toISOString(),
      }],
    });
  }

  function agregarTematica(semIdx) {
    const sem = semanas[semIdx];
    const temas = [...sem._temas, {
      texto: 'Nueva temática',
      editadoPor: user?.nombre || '',
      editadoEn: new Date().toISOString(),
    }];
    guardarSemana(semIdx, temas);
  }

  function editarResultado(semIdx, nuevoTexto) {
    const sem = semanas[semIdx];
    guardarSemana(semIdx, sem._temas, {
      resultadoAprendizaje: nuevoTexto,
      resultadoEditadoPor: user?.nombre || '',
      resultadoEditadoEn: new Date().toISOString(),
    });
  }

  async function enviarComentario(semana) {
    if (!textoComentario.trim() || !user?.nombre) return;
    setEnviando(true);
    try {
      await comentariosService.guardar({
        materiaId,
        semana,
        texto: textoComentario.trim(),
        autor: user.nombre,
        rol: user.rol || 'docente',
      });
      const nuevos = await comentariosService.listar(materiaId);
      setComentarios(nuevos);
      setTextoComentario('');
    } catch {}
    setEnviando(false);
  }

  function comentariosDeSemana(semana) {
    return comentarios.filter(c => c.semana === semana);
  }

  function exportarExcel() {
    window.open(`/api/exportar-planeador?materia=${materiaId}`, '_blank');
  }

  const groups = [];
  let current = null;
  semanas.forEach((s, idx) => {
    const name = cleanUnidad(s.unidadAprendizaje);
    if (!current || current.unidad !== name) {
      current = { unidad: name, semanas: [] };
      groups.push(current);
    }
    current.semanas.push({ ...s, _idx: idx });
  });

  const totals = { HT: 0, HP: 0, HTI: 0 };
  semanas.forEach(s => {
    totals.HT += Number(s.HT) || 0;
    totals.HP += Number(s.HP) || 0;
    totals.HTI += Number(s.HTI) || 0;
  });

  if (loading) return <SkeletonRows count={6} />;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-ink-2">
          {canEdit
            ? 'Haga clic en cualquier temática para editarla. Los cambios se guardan automáticamente.'
            : 'Identifíquese para poder editar las temáticas.'}
        </p>
        <div className="flex items-center gap-2">
          {canEdit && backupInfo?.existe && (
            <>
              {!confirmRestore ? (
                <button
                  onClick={() => setConfirmRestore(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-amber-300/50 text-amber-700 text-xs font-semibold rounded-lg hover:bg-amber-50 hover:border-amber-400 transition-all duration-200 cursor-pointer shrink-0"
                  title={`Respaldo del ${formatFecha(backupInfo.fecha)}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Restaurar original
                </button>
              ) : (
                <span className="inline-flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-300 rounded-lg text-xs animate-fade-in">
                  <span className="text-amber-800 font-semibold">¿Restaurar al estado original?</span>
                  <button
                    onClick={handleRestore}
                    disabled={restoring}
                    className="px-2 py-1 bg-amber-500 text-white rounded font-bold hover:bg-amber-600 cursor-pointer transition-colors disabled:opacity-50"
                  >
                    {restoring ? 'Restaurando…' : 'Sí, restaurar'}
                  </button>
                  <button
                    onClick={() => setConfirmRestore(false)}
                    className="px-2 py-1 bg-gray-200 text-ink rounded font-semibold hover:bg-gray-300 cursor-pointer transition-colors"
                  >
                    Cancelar
                  </button>
                </span>
              )}
            </>
          )}
          <button
            onClick={exportarExcel}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-magenta/20 text-magenta text-xs font-semibold rounded-lg hover:bg-magenta hover:text-white transition-all duration-200 cursor-pointer shrink-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Grouped blocks */}
      {groups.map((group, gi) => (
        <div key={gi} className="rounded-xl border border-magenta/12 overflow-hidden">
          {/* Unit header */}
          <div className="bg-gradient-to-r from-magenta to-magenta-dark px-5 py-3">
            <h3 className="text-white font-semibold text-sm tracking-wide">
              {group.unidad}
            </h3>
            <p className="text-white/70 text-xs mt-0.5">
              {group.semanas.length === 1
                ? `Semana ${group.semanas[0].semana}`
                : `Semanas ${group.semanas[0].semana} – ${group.semanas[group.semanas.length - 1].semana}`}
            </p>
          </div>

          {/* Week cards */}
          <div className="divide-y divide-magenta/8">
            {group.semanas.map(sem => {
              const temas = sem._temas;
              const coms = comentariosDeSemana(sem.semana);
              const isOpen = openWeek === sem.semana;
              const isSaving = saving === sem.semana;

              return (
                <div key={sem.semana} className={`bg-white transition-colors duration-200 ${isSaving ? 'bg-magenta/[0.02]' : ''}`}>
                  {/* Week content */}
                  <div className="px-5 py-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-magenta/10 text-magenta font-bold text-sm shrink-0">
                        {sem.semana}
                      </span>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-ink-2 font-medium">Semana {sem.semana}</span>
                        <TituloSesion
                          titulo={sem.tituloSesion}
                          defaultTitulo={(TITULOS_SESION[materiaId] || {})[sem.semana] || ''}
                          canEdit={canEdit}
                          onSave={nuevoTitulo => guardarSemana(sem._idx, sem._temas, { tituloSesion: nuevoTitulo })}
                        />
                      </div>
                      {isSaving && (
                        <span className="text-[10px] text-magenta animate-pulse">Guardando…</span>
                      )}
                      {/* Hour badges */}
                      <div className="flex gap-1.5 ml-auto">
                        {[['HT', sem.HT], ['HP', sem.HP], ['HTI', sem.HTI]].map(([label, val]) => (
                          <span key={label} className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-magenta/8 text-magenta text-[10px] font-semibold">
                            {label} {val || 0}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Temáticas list — editable */}
                    <div className="space-y-1.5 ml-11">
                      {temas.length > 0 ? (
                        temas.map((t, ti) => (
                          <EditableItem
                            key={`${sem.semana}-${ti}`}
                            item={t}
                            canEdit={canEdit}
                            onSave={nuevoTexto => editarTematica(sem._idx, ti, nuevoTexto)}
                            onRemove={() => eliminarTematica(sem._idx, ti)}
                          />
                        ))
                      ) : (
                        <p className="text-sm text-ink-2/40 italic">Sin temáticas registradas.</p>
                      )}

                      {/* Add temática button */}
                      {canEdit && (
                        <button
                          onClick={() => agregarTematica(sem._idx)}
                          className="inline-flex items-center gap-1 text-xs text-magenta/60 hover:text-magenta transition-colors duration-150 mt-1 cursor-pointer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                          Agregar temática
                        </button>
                      )}
                    </div>

                    {/* Resultado de aprendizaje — editable */}
                    <EditableResultado
                      value={sem.resultadoAprendizaje}
                      editadoPor={sem.resultadoEditadoPor}
                      editadoEn={sem.resultadoEditadoEn}
                      canEdit={canEdit}
                      onSave={nuevoTexto => editarResultado(sem._idx, nuevoTexto)}
                    />

                    {/* Comments toggle */}
                    <div className="mt-3 ml-11">
                      <button
                        onClick={() => {
                          setOpenWeek(isOpen ? null : sem.semana);
                          setTextoComentario('');
                        }}
                        className="inline-flex items-center gap-1.5 text-xs text-ink-2 hover:text-magenta transition-colors duration-200 cursor-pointer"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        {coms.length > 0
                          ? `${coms.length} sugerencia${coms.length > 1 ? 's' : ''}`
                          : 'Sugerencias'}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Expanded comments section */}
                  {isOpen && (
                    <div className="px-5 pb-4 animate-fade-in">
                      <div className="ml-11 border-t border-magenta/8 pt-3 space-y-3">
                        {coms.length > 0 && (
                          <div className="space-y-2">
                            {coms.map((c, ci) => (
                              <div key={ci} className="bg-mist rounded-lg px-3 py-2.5">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="w-5 h-5 rounded-full bg-magenta/20 text-magenta flex items-center justify-center text-[10px] font-bold">
                                    {(c.autor || '?')[0].toUpperCase()}
                                  </span>
                                  <span className="text-xs font-semibold text-ink">{c.autor}</span>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${ROL_COLORS[c.rol] || ROL_COLORS.docente}`}>
                                    {c.rol}
                                  </span>
                                  <span className="text-[10px] text-ink-2/50 ml-auto">{formatFecha(c.createdAt)}</span>
                                </div>
                                <p className="text-xs text-ink-2 leading-relaxed ml-7">{c.texto}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {user?.nombre ? (
                          <div className="flex gap-2">
                            <textarea
                              value={textoComentario}
                              onChange={e => setTextoComentario(e.target.value)}
                              placeholder="Escriba una sugerencia o cambio para esta semana…"
                              rows={2}
                              className="flex-1 px-3 py-2 text-xs border border-magenta/20 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-magenta/20 focus:border-magenta resize-none transition-all duration-200"
                            />
                            <button
                              onClick={() => enviarComentario(sem.semana)}
                              disabled={enviando || !textoComentario.trim()}
                              className="self-end px-4 py-2 bg-magenta text-white text-xs font-semibold rounded-lg hover:bg-magenta-dark disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer shrink-0"
                            >
                              {enviando ? 'Enviando…' : 'Enviar'}
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-ink-2/50 italic">
                            Identifíquese primero para agregar sugerencias.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Totals summary */}
      <div className="flex items-center justify-between bg-gradient-to-r from-magenta/5 to-magenta/10 rounded-xl px-5 py-3">
        <span className="text-sm font-semibold text-ink">Resumen de horas</span>
        <div className="flex items-center gap-4">
          {[
            ['Horas teóricas', totals.HT],
            ['Horas prácticas', totals.HP],
            ['Horas trabajo independiente', totals.HTI],
          ].map(([label, val]) => (
            <div key={label} className="text-center">
              <p className="text-lg font-bold text-magenta">{val}</p>
              <p className="text-[10px] text-ink-2">{label}</p>
            </div>
          ))}
          <div className="border-l border-magenta/20 pl-4 text-center">
            <p className="text-lg font-bold text-magenta-dark">{totals.HT + totals.HP + totals.HTI}</p>
            <p className="text-[10px] text-ink-2 font-semibold">Total</p>
          </div>
        </div>
      </div>
    </div>
  );
}
