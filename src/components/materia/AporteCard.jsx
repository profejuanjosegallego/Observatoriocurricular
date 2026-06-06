import { useState, useEffect, useRef } from 'react';
import { useUser } from '../../context/UserContext';
import { matchesName } from '../../utils/nameMatch';

const ROLE_LABELS = {
  docente: 'Docente',
  experto: 'Experto',
  coordinador: 'Coordinador',
  admin: 'Admin',
};

export default function AporteCard({ aporte, onSave }) {
  const { user } = useUser();
  const initial = (aporte.profesor || '?').trim().charAt(0).toUpperCase();
  const fecha = aporte.updatedAt
    ? new Date(aporte.updatedAt).toLocaleDateString('es-CO')
    : '';
  const rolLabel = ROLE_LABELS[aporte.rol] || 'Docente';

  const isOwner = matchesName(user?.nombre || '', aporte.profesor);
  const isAdmin = user?.rol === 'admin';
  const canEdit = isOwner || isAdmin;

  const [editing, setEditing] = useState(false);
  const [comprension, setComprension] = useState('');
  const [saber, setSaber] = useState('');
  const [saberHacer, setSaberHacer] = useState('');
  const [saberSer, setSaberSer] = useState('');
  const [saving, setSaving] = useState(false);
  const formRef = useRef(null);

  function startEdit() {
    setComprension(aporte.comprension || '');
    setSaber(aporte.saber || '');
    setSaberHacer(aporte.saberHacer || '');
    setSaberSer(aporte.saberSer || '');
    setEditing(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await onSave({
        materiaId: aporte.materiaId,
        profesor: aporte.profesor,
        rol: aporte.rol || user?.rol || 'docente',
        comprension,
        saber,
        saberHacer,
        saberSer,
      });
      setEditing(false);
    } catch {}
    setSaving(false);
  }

  if (editing) {
    return (
      <div ref={formRef} className={`border rounded-2xl p-5 bg-white shadow-lg shadow-magenta/10 border-magenta/30 animate-fade-in`}>
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <span className="w-9 h-9 rounded-full bg-gradient-to-br from-magenta to-magenta-soft text-white grid place-items-center font-bold text-sm shrink-0">
            {initial}
          </span>
          <div className="flex-1 min-w-0">
            <b className="font-heading text-sm block break-words">
              {aporte.profesor}
              <span className="ml-2 text-[10px] font-semibold text-magenta bg-magenta/8 px-1.5 py-0.5 rounded-full align-middle">
                Editando
              </span>
            </b>
            <span className="text-xs text-ink-2">
              <span className="inline-block bg-magenta/8 text-magenta-dark rounded-full px-2 py-0.5 text-[0.65rem] font-semibold">
                {rolLabel}
              </span>
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-ink mb-1">
              ¿Cómo se entiende al <em>consultor</em> en este submódulo?
            </label>
            <textarea
              value={comprension}
              onChange={e => setComprension(e.target.value)}
              placeholder="Describa la visión del perfil del consultor para esta materia…"
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-magenta/15 bg-mist text-sm resize-y focus:outline-none focus:border-magenta focus:bg-white focus:ring-2 focus:ring-magenta/10 transition-all duration-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1">
                Saber <span className="font-normal text-ink-2">(conocimientos)</span>
              </label>
              <textarea
                value={saber}
                onChange={e => setSaber(e.target.value)}
                placeholder="Conceptos, teorías, principios…"
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-magenta/15 bg-mist text-sm resize-y focus:outline-none focus:border-magenta focus:bg-white focus:ring-2 focus:ring-magenta/10 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Saber-hacer <span className="font-normal text-ink-2">(habilidades)</span>
              </label>
              <textarea
                value={saberHacer}
                onChange={e => setSaberHacer(e.target.value)}
                placeholder="Destrezas prácticas y cognitivas…"
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-magenta/15 bg-mist text-sm resize-y focus:outline-none focus:border-magenta focus:bg-white focus:ring-2 focus:ring-magenta/10 transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Saber-ser <span className="font-normal text-ink-2">(actitudes)</span>
              </label>
              <textarea
                value={saberSer}
                onChange={e => setSaberSer(e.target.value)}
                placeholder="Autonomía, responsabilidad, trabajo en equipo…"
                rows={3}
                className="w-full px-3 py-2 rounded-xl border border-magenta/15 bg-mist text-sm resize-y focus:outline-none focus:border-magenta focus:bg-white focus:ring-2 focus:ring-magenta/10 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 rounded-full bg-gradient-to-r from-magenta to-magenta-dark text-white font-semibold text-sm shadow-md shadow-magenta/20 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-wait cursor-pointer"
            >
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
            <button
              onClick={() => setEditing(false)}
              disabled={saving}
              className="px-4 py-2 text-sm text-ink-2 hover:text-ink hover:bg-gray-100 rounded-full transition-all duration-200 cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`border rounded-2xl p-5 bg-mist/50 hover:shadow-md transition-all duration-300 animate-fade-in ${isOwner ? 'border-magenta/25 ring-1 ring-magenta/8' : 'border-magenta/12'}`}>
      <div className="flex items-center gap-3 mb-3 flex-wrap">
        <span className="w-9 h-9 rounded-full bg-gradient-to-br from-magenta to-magenta-soft text-white grid place-items-center font-bold text-sm shrink-0">
          {initial}
        </span>
        <div className="flex-1 min-w-0">
          <b className="font-heading text-sm block break-words">
            {aporte.profesor}
            {isOwner && (
              <span className="ml-2 text-[10px] font-semibold text-magenta bg-magenta/8 px-1.5 py-0.5 rounded-full align-middle">
                Mi aporte
              </span>
            )}
          </b>
          <span className="text-xs text-ink-2">
            <span className="inline-block bg-magenta/8 text-magenta-dark rounded-full px-2 py-0.5 text-[0.65rem] font-semibold mr-1.5">
              {rolLabel}
            </span>
            {fecha && <>Actualizado el {fecha}</>}
          </span>
        </div>
        {canEdit && (
          <button
            onClick={startEdit}
            className="inline-flex items-center gap-1.5 text-ink-2/40 hover:text-magenta transition-all duration-200 cursor-pointer p-1.5 rounded-lg hover:bg-magenta/5"
            title="Editar mi aporte"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
      </div>

      {aporte.comprension && (
        <p className="text-sm text-ink-2 italic mb-3 pl-3 border-l-3 border-magenta">
          &ldquo;{aporte.comprension}&rdquo;
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {[
          { label: 'Saber', value: aporte.saber },
          { label: 'Saber-hacer', value: aporte.saberHacer },
          { label: 'Saber-ser', value: aporte.saberSer },
        ].map(s => (
          <div key={s.label} className="bg-white border border-magenta/10 rounded-xl p-3">
            <span className="block text-[0.65rem] tracking-wide uppercase font-bold text-magenta mb-1">
              {s.label}
            </span>
            <p className="text-xs text-ink-2 whitespace-pre-wrap">{s.value || '—'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
