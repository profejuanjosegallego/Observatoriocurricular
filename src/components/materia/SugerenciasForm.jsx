import { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { matchesName } from '../../utils/nameMatch';

export default function SugerenciasForm({ materiaId, sugerencias, onSave, onDelete }) {
  const { user } = useUser();
  const nombre = user?.nombre || '';

  const [semana, setSemana] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: '', ok: false });

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
  }

  function cancelEdit() {
    setEditId(null);
    setSemana('');
    setTitulo('');
    setDescripcion('');
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!semana.trim() || !titulo.trim()) return;
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
      {sugerencias.length > 0 && (
        <div className="space-y-2">
          {sugerencias.map(s => {
            const isOwner = matchesName(nombre, s.profesor);
            const canManage = isOwner || user?.rol === 'admin';
            return (
              <div key={s._id} className="flex items-start gap-3 bg-white border border-amber-200/30 rounded-xl p-3 group">
                <span className="inline-flex items-center justify-center w-14 h-6 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold shrink-0 mt-0.5">
                  Sem. {s.semana}
                </span>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-ink">{s.titulo}</h4>
                  {s.descripcion && <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">{s.descripcion}</p>}
                  <span className="text-[10px] text-ink-2/50 mt-1 block">{s.profesor}</span>
                </div>
                {canManage && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => startEdit(s)} className="text-[10px] text-amber-700 hover:text-amber-900 font-semibold px-2 py-1 rounded-md hover:bg-amber-50 cursor-pointer transition-colors">Editar</button>
                    <button onClick={() => handleDelete(s._id)} className="text-[10px] text-red-500 hover:text-red-700 font-semibold px-2 py-1 rounded-md hover:bg-red-50 cursor-pointer transition-colors">Eliminar</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 border border-amber-200/30 rounded-xl p-4 space-y-3">
        <h4 className="text-sm font-heading font-semibold text-ink">
          {editId ? 'Editar sugerencia' : 'Proponer un ajuste al planeador'}
        </h4>
        <div className="grid grid-cols-[100px_1fr] gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1 text-ink-2">Semana</label>
            <input
              type="text"
              value={semana}
              onChange={e => setSemana(e.target.value)}
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
              onChange={e => setTitulo(e.target.value)}
              placeholder="Ej: Incluir ejercicio de auditoría de código con IA"
              required
              className="w-full px-3 py-2 rounded-lg border border-amber-200/50 bg-white text-sm focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200/30 transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1 text-ink-2">Descripción o justificación <span className="font-normal text-ink-2/50">(opcional)</span></label>
          <textarea
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            placeholder="¿Por qué este ajuste aumentaría la alineación curricular? ¿En qué se basa?"
            rows={2}
            className="w-full px-3 py-2 rounded-lg border border-amber-200/50 bg-white text-sm resize-y focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-200/30 transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-heading font-semibold text-sm shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            {editId ? 'Actualizar' : 'Agregar sugerencia'}
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
    </div>
  );
}
