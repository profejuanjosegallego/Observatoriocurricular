import { NavLink } from 'react-router-dom';
import { NIVELES, getMateriasPorNivel } from '../../data/materias';

export default function Sidebar({ aporteCounts }) {
  return (
    <aside className="space-y-5 lg:sticky lg:top-[76px]">
      {NIVELES.map(nv => (
        <div key={nv.nivel}>
          <span className="block text-[0.7rem] font-bold tracking-[0.14em] uppercase text-ink-2 mb-2 pl-1">
            {nv.nombre}
          </span>
          {getMateriasPorNivel(nv.nivel).map(m => {
            const count = aporteCounts[m.id] || 0;
            return (
              <NavLink
                key={m.id}
                to={`/materia/${m.id}`}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 w-full text-left rounded-xl px-3.5 py-3 mb-2 text-sm font-medium transition-all duration-300 border ${
                    isActive
                      ? 'bg-gradient-to-r from-magenta to-magenta-dark text-white border-transparent shadow-lg shadow-magenta/30'
                      : 'bg-white border-magenta/12 text-ink hover:border-magenta hover:translate-x-1'
                  }`
                }
              >
                {m.nombre}
                <span
                  className={`ml-auto text-[0.68rem] font-bold rounded-full px-2 py-0.5 ${
                    count > 0
                      ? 'bg-white/20 text-current'
                      : 'bg-mist text-magenta'
                  }`}
                >
                  {count}
                </span>
              </NavLink>
            );
          })}
        </div>
      ))}
    </aside>
  );
}
