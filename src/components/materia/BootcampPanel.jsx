import { getMateria } from '../../data/materias';
import { getBootcamp } from '../../data/integradores';

const NIVEL_COLORS = {
  1: { bg: 'from-indigo-500 to-indigo-600', accent: '#6366f1', light: 'bg-indigo-50', border: 'border-indigo-200' },
  2: { bg: 'from-magenta to-magenta-dark', accent: '#E6007E', light: 'bg-magenta/5', border: 'border-magenta/15' },
  3: { bg: 'from-emerald-500 to-emerald-600', accent: '#10b981', light: 'bg-emerald-50', border: 'border-emerald-200' },
};

export default function BootcampPanel({ nivel }) {
  const bc = getBootcamp(nivel);
  const colors = NIVEL_COLORS[nivel];

  if (!bc) {
    return (
      <div className="text-center py-10 text-ink-2 animate-fade-in">
        <p className="text-sm">No se ha configurado el bootcamp para este nivel.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Hero */}
      <div className={`bg-gradient-to-r ${colors.bg} rounded-2xl p-6 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] font-bold tracking-wider uppercase bg-white/15 backdrop-blur px-2.5 py-1 rounded-full">
              {bc.duracion}
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase bg-white/15 backdrop-blur px-2.5 py-1 rounded-full">
              {bc.cuando}
            </span>
          </div>
          <h3 className="font-heading font-bold text-xl mt-2">{bc.nombre}</h3>
          <p className="text-white/80 text-sm mt-2 max-w-2xl leading-relaxed">{bc.objetivo}</p>

          <div className="flex flex-wrap gap-2 mt-3">
            {bc.materias.map(mid => {
              const m = getMateria(mid);
              return (
                <span key={mid} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/15">
                  {m?.nombre}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reto */}
      <div className={`${colors.light} border ${colors.border} rounded-xl p-5`}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: colors.accent + '15' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: colors.accent }}>El reto</p>
            <p className="text-sm text-ink-2 leading-relaxed">{bc.reto}</p>
          </div>
        </div>
      </div>

      {/* Agenda del día */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h4 className="font-heading font-bold text-sm text-ink mb-4 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Agenda del día
        </h4>
        <div className="relative">
          <div className="absolute left-[52px] top-3 bottom-3 w-0.5" style={{ backgroundColor: colors.accent + '20' }} />
          <div className="space-y-3">
            {bc.agenda.map((item, i) => {
              const isBreak = item.actividad.toLowerCase().includes('almuerzo');
              const isDemo = item.actividad.toLowerCase().includes('sustentación') || item.actividad.toLowerCase().includes('demo') || item.actividad.toLowerCase().includes('review');
              return (
                <div key={i} className="flex items-start gap-3 relative">
                  <span className="text-[11px] font-mono font-semibold text-ink-2 w-[44px] shrink-0 text-right pt-2.5">
                    {item.hora.split('–')[0].trim()}
                  </span>
                  <div
                    className="absolute left-[50px] top-3 w-2 h-2 rounded-full border-2 border-white z-10"
                    style={{ backgroundColor: isDemo ? '#f59e0b' : isBreak ? '#9ca3af' : colors.accent }}
                  />
                  <div className={`flex-1 rounded-lg p-3 ml-4 ${
                    isDemo ? 'bg-amber-50 border border-amber-200/50' : isBreak ? 'bg-gray-50' : 'bg-gray-50/50 hover:bg-gray-50'
                  } transition-colors`}>
                    <p className={`text-sm font-medium ${isDemo ? 'font-semibold text-amber-800' : isBreak ? 'text-ink-2' : 'text-ink'}`}>
                      {item.actividad}
                    </p>
                    <p className="text-[10px] text-ink-2/60 mt-0.5">{item.hora}</p>
                    {item.tematicas?.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {item.tematicas.map((t, j) => (
                          <li key={j} className="flex items-start gap-1.5 text-xs text-ink-2 leading-relaxed">
                            <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full" style={{ backgroundColor: colors.accent + '80' }} />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Competencias que se evalúan */}
      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h4 className="font-heading font-bold text-sm text-ink mb-3 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          Competencias que se demuestran
        </h4>
        <div className="space-y-2">
          {bc.competencias.map((comp, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-bold text-white" style={{ backgroundColor: colors.accent }}>
                {i + 1}
              </div>
              <p className="text-sm text-ink-2 leading-relaxed">{comp}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Nota sobre empresa invitada */}
      <div className="rounded-xl p-4 border-2 border-dashed" style={{ borderColor: colors.accent + '30', backgroundColor: colors.accent + '05' }}>
        <div className="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 mt-0.5" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <div>
            <p className="text-xs font-semibold text-ink mb-1">Empresa invitada</p>
            <p className="text-xs text-ink-2 leading-relaxed">
              El bootcamp se realiza con una empresa real del territorio antioqueño que presenta un reto auténtico. Los estudiantes no resuelven un ejercicio académico: enfrentan una necesidad real y sustentan su solución ante el cliente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
