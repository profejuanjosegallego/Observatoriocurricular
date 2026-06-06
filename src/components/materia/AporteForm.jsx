import { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { matchesName } from '../../utils/nameMatch';

const GUIA = [
  {
    campo: 'Comprensión del consultor',
    pregunta: '¿Cómo se entiende al consultor en este submódulo?',
    descripcion: 'Describa con sus palabras qué papel juega el perfil del «Consultor Tech» dentro de esta materia. No se trata de definir la materia en sí, sino de explicar cómo sus contenidos contribuyen a que el egresado actúe como consultor tecnológico.',
    ejemplo: 'En Lógica de Programación, el consultor se entiende como el profesional que traduce las necesidades del cliente en estructuras lógicas antes de escribir código.',
  },
  {
    campo: 'Saber',
    pregunta: '¿Qué conocimientos debe dominar el estudiante?',
    descripcion: 'Conceptos, teorías, principios y hechos que el estudiante necesita comprender. Piense en lo que debería poder explicar en una entrevista de trabajo o en una reunión con un cliente.',
    ejemplo: 'Variables, tipos de datos, operadores, estructuras condicionales, ciclos repetitivos, funciones, arreglos.',
  },
  {
    campo: 'Saber-hacer',
    pregunta: '¿Qué debe ser capaz de hacer con esos conocimientos?',
    descripcion: 'Habilidades prácticas y cognitivas que el estudiante demuestra haciendo. No solo «conocer» un concepto sino aplicarlo para resolver problemas reales. Incluya tanto destrezas técnicas como cognitivas (analizar, diseñar, depurar).',
    ejemplo: 'Diseñar algoritmos para problemas de complejidad media, depurar código con herramientas de traza, documentar soluciones de forma clara.',
  },
  {
    campo: 'Saber-ser',
    pregunta: '¿Qué actitudes y valores debe desarrollar?',
    descripcion: 'Disposiciones personales, hábitos profesionales y habilidades blandas. Piense en autonomía, responsabilidad, trabajo en equipo, ética, comunicación y adaptabilidad al cambio.',
    ejemplo: 'Persistencia ante el error, disposición para el trabajo colaborativo, responsabilidad con los plazos de entrega, comunicación clara de ideas técnicas.',
  },
];

export default function AporteForm({ materiaId, aportes, onSave }) {
  const { user } = useUser();
  const nombre = user?.nombre || '';
  const rol = user?.rol || 'docente';

  const existente = aportes.find(x => matchesName(x.profesor, nombre));
  const [showGuia, setShowGuia] = useState(false);

  const [comprension, setComprension] = useState('');
  const [saber, setSaber] = useState('');
  const [saberHacer, setSaberHacer] = useState('');
  const [saberSer, setSaberSer] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ text: '', ok: false });

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setMsg({ text: '', ok: false });
    try {
      await onSave({ materiaId, profesor: nombre, rol, comprension, saber, saberHacer, saberSer });
      setMsg({ text: '✓ Aporte registrado correctamente.', ok: true });
      setComprension(''); setSaber(''); setSaberHacer(''); setSaberSer('');
    } catch (err) {
      setMsg({ text: `✗ ${err.message}`, ok: false });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Guía de ayuda */}
      <div className="border border-magenta/12 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowGuia(!showGuia)}
          className="w-full flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-magenta/5 to-magenta-soft/5 hover:from-magenta/8 hover:to-magenta-soft/8 transition-all duration-300 cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-magenta shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <span className="text-sm font-semibold text-ink">
            ¿Qué escribir en cada campo?
          </span>
          <span className="text-[10px] text-ink-2/60 ml-1">Guía rápida</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-4 h-4 text-ink-2/40 ml-auto transition-transform duration-300 ${showGuia ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {showGuia && (
          <div className="px-4 pb-4 pt-2 space-y-3 animate-fade-in">
            <p className="text-xs text-ink-2 leading-relaxed">
              Cada aporte alimenta la construcción colectiva del perfil del Consultor Tech. Las dimensiones siguen el Marco Nacional de Cualificaciones (MNC):
              <strong> Saber</strong> (conocimientos), <strong>Saber-hacer</strong> (destrezas) y <strong>Saber-ser</strong> (actitudes y autonomía). Escriba desde su experiencia docente o profesional.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {GUIA.map(g => (
                <div key={g.campo} className="bg-white border border-magenta/8 rounded-lg p-3">
                  <h4 className="text-xs font-bold text-magenta mb-0.5">{g.campo}</h4>
                  <p className="text-[11px] text-ink font-medium mb-1">{g.pregunta}</p>
                  <p className="text-[11px] text-ink-2 leading-relaxed mb-1.5">{g.descripcion}</p>
                  <div className="bg-mist rounded-md px-2.5 py-1.5">
                    <span className="text-[10px] font-semibold text-ink-2/50 uppercase tracking-wide">Ejemplo:</span>
                    <p className="text-[11px] text-ink-2 italic leading-relaxed">{g.ejemplo}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Formulario de creación solo si el usuario no tiene aporte */}
      {nombre && !existente && (
        <form onSubmit={handleSubmit} className="border border-magenta/15 rounded-2xl p-5 bg-white space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-magenta to-magenta-soft text-white grid place-items-center font-bold text-xs shrink-0">
              {nombre.charAt(0).toUpperCase()}
            </span>
            <span className="text-sm font-semibold text-ink">{nombre}</span>
            <span className="text-[10px] text-magenta bg-magenta/8 px-1.5 py-0.5 rounded-full font-semibold">Nuevo aporte</span>
          </div>

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

          <div className="flex items-center gap-4 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-magenta to-magenta-dark text-white font-semibold text-sm shadow-md shadow-magenta/20 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-wait cursor-pointer"
            >
              {saving ? 'Guardando…' : 'Guardar aporte'}
            </button>
            {msg.text && (
              <span className={`text-sm font-semibold ${msg.ok ? 'text-ok' : 'text-magenta-dark'}`}>
                {msg.text}
              </span>
            )}
          </div>
        </form>
      )}

      {!nombre && (
        <div className="text-center py-6 bg-mist border border-dashed border-magenta/15 rounded-xl">
          <p className="text-sm text-ink-2">Identifíquese primero para registrar un aporte.</p>
        </div>
      )}
    </div>
  );
}
