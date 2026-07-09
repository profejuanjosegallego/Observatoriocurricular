import { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { sintesisService } from '../../services/api';

const NOMBRES_COMPONENTE = {
  consultorTech: 'Perfil Consultor Tech',
  marcoNacional: 'Marco Nacional (MNC)',
  empleabilidad: 'Empleabilidad',
  estrategiaPedagogica: 'Estrategia pedagógica',
};

export default function SugerenciasForm({ materiaId, sugerencias, onSave, onDelete }) {
  const { user } = useUser();
  const nombre = user?.nombre || '';

  const [semana, setSemana] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [temario, setTemario] = useState('');
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: '', ok: false });
  const [analisis, setAnalisis] = useState(null);
  const [analizando, setAnalizando] = useState(false);

  if (!nombre) {
    return (
      <div className="text-center py-6 bg-mist border border-dashed border-amber-300/40 rounded-xl">
        <p className="text-sm text-ink-2">Identifíquese para proponer sugerencias al planeador.</p>
      </div>
    );
  }

  function startEdit(s) {
    setEditId(s._id);
    setSemana(s.semana);
    setTitulo(s.titulo);
    setDescripcion(s.descripcion);
    setTemario(s.temario || '');
  }

  function cancelEdit() {
    setEditId(null);
    setSemana('');
    setTitulo('');
    setDescripcion('');
    setTemario('');
    setAnalisis(null);
  }

  // Si el docente edita el texto tras analizar, se invalida el análisis previo.
  function alEditarCampo(setter) {
    return (e) => { setter(e.target.value); if (analisis) setAnalisis(null); };
  }

  // Paso 1: analizar con IA y mostrar a qué componentes aporta (NO registra todavía).
  async function handleAnalizar(e) {
    e.preventDefault();
    if (!semana.trim() || !titulo.trim()) return;
    setAnalizando(true);
    setMsg({ text: '', ok: false });
    try {
      const cls = await sintesisService.clasificarSugerencia(materiaId, `${titulo.trim()}. ${descripcion.trim()}. ${temario.trim()}`);
      setAnalisis(cls);
    } catch (err) {
      const m = (err && err.message) || '';
      const limite = /rate limit|l[ií]mite|TPD|tokens per day/i.test(m);
      setAnalisis({ componentes: [], comentario: '', error: true, limite });
    } finally {
      setAnalizando(false);
    }
  }

  // Paso 2: el docente confirma y se registra la sugerencia.
  async function handleConfirmar() {
    setSaving(true);
    setMsg({ text: '', ok: false });
    try {
      await onSave({
        _id: editId || undefined,
        materiaId,
        profesor: nombre,
        semana: semana.trim(),
        titulo: titulo.trim(),
        descripcion: descripcion.trim(),
        temario: temario.trim(),
      });
      setMsg({ text: editId ? 'Sugerencia actualizada.' : 'Sugerencia registrada.', ok: true });
      cancelEdit();
    } catch (err) {
      setMsg({ text: err.message, ok: false });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await onDelete(id);
    } catch {}
  }

  return (
    <div className="space-y-4">
      <p className="text-xs text-ink-2/70">
        Las sugerencias registradas se muestran y gestionan en la pestaña <strong>Ficha general</strong>, dentro de «Sugerencias para aumentar la alineación».
      </p>

      <form onSubmit={handleAnalizar} className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 border border-amber-200/30 rounded-xl p-4 space-y-3">
        <h4 className="text-sm font-heading font-semibold text-ink">
          {editId ? 'Editar sugerencia' : 'Proponer un ajuste al planeador'}
        </h4>
        <div className="grid grid-cols-[100px_1fr] gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1 text-ink-2">Semana</label>
            <input
              type="text"
              value={semana}
              onChange={alEditarCampo(setSemana)}
              placeholder="Ej: 5–6"
              required
              className="w-full px-3 py-2 rounded-lg border border-amber-200/50 bg-white text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200/30 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-ink-2">Título del ajuste</label>
            <input
              type="text"
              value={titulo}
              onChange={alEditarCampo(setTitulo)}
              placeholder="Ej: Incluir ejercicio de auditoría de código con IA"
              required
              className="w-full px-3 py-2 rounded-lg border border-amber-200/50 bg-white text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200/30 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 text-ink-2">Justificación <span className="font-normal text-ink-2/50">(opcional)</span></label>
          <textarea
            value={descripcion}
            onChange={alEditarCampo(setDescripcion)}
            placeholder="¿Por qué este ajuste aumentaría la alineación curricular? ¿En qué se basa?"
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-amber-200/50 bg-white text-sm resize-y focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200/30 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 text-ink-2">Temario <span className="font-normal text-ink-2/50">(cómo quedaría en el planeador)</span></label>
          <textarea
            value={temario}
            onChange={alEditarCampo(setTemario)}
            placeholder="Texto tal como aparecería en la casilla de temáticas de esa semana: subtemas, actividades o contenidos concretos."
            rows={3}
            className="w-full px-3 py-2 rounded-lg border border-amber-200/50 bg-white text-sm resize-y focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200/30 transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={analizando || saving}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-heading font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            {analizando ? 'Analizando con IA…' : (analisis ? 'Volver a analizar' : 'Analizar con IA')}
          </button>
          {editId && (
            <button type="button" onClick={cancelEdit} className="text-sm text-ink-2 hover:text-ink cursor-pointer transition-colors">
              Cancelar
            </button>
          )}
          {msg.text && (
            <span className={`text-xs font-semibold ${msg.ok ? 'text-ok' : 'text-red-500'}`}>{msg.text}</span>
          )}
        </div>
      </form>

      {analisis && (
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 animate-fade-in">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-violet-700 mb-1.5">Chequeo con IA</span>
          {analisis.error ? (
            <p className="text-xs text-ink-2">
              {analisis.limite
                ? 'Se alcanzó el límite diario de uso de la IA (plan gratuito de Groq). Inténtelo más tarde; puede registrar la sugerencia de todas formas.'
                : 'No se pudo analizar con IA en este momento. Puede registrar la sugerencia de todas formas.'}
            </p>
          ) : analisis.componentes && analisis.componentes.length > 0 ? (
            <>
              <p className="text-xs text-ink-2 mb-1.5">Esta sugerencia aporta a:</p>
              <div className="flex flex-wrap gap-1.5">
                {analisis.componentes.map(c => (
                  <span key={c} className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 border border-violet-200 text-violet-700">
                    {NOMBRES_COMPONENTE[c] || c}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-ink-2">La IA no detecta un aporte claro a ninguna de las 4 componentes de alineación. Puede reformularla para que apunte a alguna (Consultor Tech, MNC, Empleabilidad o Estrategia pedagógica) o registrarla de todas formas.</p>
          )}
          {analisis.comentario && <p className="text-[11px] text-ink-2/70 italic mt-1.5">{analisis.comentario}</p>}

          {/* Confirmación: el docente decide si la agrega o no */}
          <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-violet-200/60">
            <button
              type="button"
              onClick={handleConfirmar}
              disabled={saving}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 disabled:opacity-50 cursor-pointer transition-colors"
            >
              {saving ? 'Agregando…' : 'Confirmar y agregar'}
            </button>
            <button
              type="button"
              onClick={() => setAnalisis(null)}
              disabled={saving}
              className="px-3 py-1.5 text-xs text-ink-2 hover:text-ink cursor-pointer transition-colors"
            >
              Descartar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
