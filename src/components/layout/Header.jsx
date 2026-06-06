import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const ROLE_LABELS = {
  admin: 'Administrador',
  docente: 'Docente',
  experto: 'Experto externo',
  coordinador: 'Coordinador académico',
};

export default function Header({ onOpenRoleSelector }) {
  const { user } = useUser();

  return (
    <header className="bg-white border-b border-magenta/15 sticky top-0 z-30">
      <div className="max-w-[1200px] mx-auto px-4 py-3.5 flex items-center gap-3 flex-wrap">
        <Link to="/" className="w-10 h-10 rounded-xl bg-gradient-to-br from-magenta to-magenta-soft grid place-items-center text-white shadow-lg shadow-magenta/30 shrink-0 hover:scale-105 transition-transform duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </Link>
        <span className="font-heading">
          <span className="font-extrabold text-lg tracking-tight">Observatorio Curricular</span>
          <span className="block text-[0.65rem] font-medium tracking-[0.16em] text-magenta uppercase">
            CESDE · Desarrollo de Software
          </span>
        </span>

        <button
          onClick={onOpenRoleSelector}
          className="ml-auto md:ml-4 flex items-center gap-2 bg-magenta-light border border-magenta/15 rounded-full px-3.5 py-1.5 text-sm font-medium text-magenta-dark hover:border-magenta hover:shadow-md transition-all duration-300 cursor-pointer"
        >
          {user ? (
            <>
              <span className="w-6 h-6 rounded-full bg-gradient-to-br from-magenta to-magenta-soft text-white grid place-items-center text-xs font-bold">
                {user.nombre.charAt(0).toUpperCase()}
              </span>
              <span className="hidden sm:inline">{user.nombre}</span>
              <span className="text-xs opacity-70">· {ROLE_LABELS[user.rol] || user.rol}</span>
            </>
          ) : (
            <span>Identificarse</span>
          )}
        </button>
      </div>
    </header>
  );
}
