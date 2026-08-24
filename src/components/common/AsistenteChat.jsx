import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  BASE_CONOCIMIENTO,
  CATEGORIAS,
  SUGERENCIAS_INICIALES,
  buscarEnBase,
  entradaPorId,
  entradaComoContexto,
  UMBRAL_DIRECTO,
} from '../../data/asistente';
import { asistenteService } from '../../services/api';

// Asistente de acompañamiento del inicio.
//
// Estrategia de respuesta, en este orden:
//   1. Se busca en la base de conocimiento del navegador. Si la coincidencia es clara,
//      se responde al instante, sin red y sin consumir el cupo diario de IA.
//   2. Si no hay coincidencia clara, la pregunta va a la IA con los fragmentos más
//      cercanos como contexto, de modo que la respuesta quede anclada a lo verificado.
//   3. Si la IA falla o no hay cupo, se ofrece lo más parecido de la base local.

const ICONOS = {
  plataforma: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  git: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 3v12m0 0a3 3 0 103 3 3 3 0 00-3-3zm12-6a3 3 0 11-3-3 3 3 0 013 3zm0 0v2a4 4 0 01-4 4h-2a4 4 0 00-4 4" />
    </svg>
  ),
  gitflow: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
    </svg>
  ),
};

let contadorMensajes = 0;
const nuevoId = () => `m${++contadorMensajes}`;

const MENSAJE_INICIAL = {
  id: 'inicio',
  autor: 'asistente',
  texto:
    'Buen día. Este asistente resuelve dudas sobre el uso del Observatorio Curricular y sobre los fundamentos de Git y GitFlow. Escriba su pregunta o elija una de las siguientes.',
};

/** Convierte una entrada de la base en el cuerpo de un mensaje del asistente. */
function mensajeDesdeEntrada(entrada) {
  return {
    id: nuevoId(),
    autor: 'asistente',
    texto: entrada.respuesta,
    pasos: entrada.pasos || null,
    comandos: entrada.comandos || null,
    relacionados: (entrada.relacionados || []).map(entradaPorId).filter(Boolean),
    origen: 'base',
  };
}

export default function AsistenteChat() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState([MENSAJE_INICIAL]);
  const [texto, setTexto] = useState('');
  const [cargando, setCargando] = useState(false);
  const [categoria, setCategoria] = useState(null);

  const conversacionRef = useRef(null);
  const inputRef = useRef(null);

  // Se mueve el scroll del propio contenedor y no con scrollIntoView, que arrastraría
  // también el desplazamiento de la página que está detrás del panel.
  useEffect(() => {
    const caja = conversacionRef.current;
    if (abierto && caja) caja.scrollTo({ top: caja.scrollHeight, behavior: 'smooth' });
  }, [mensajes, abierto, cargando]);

  useEffect(() => {
    if (abierto) inputRef.current?.focus();
  }, [abierto]);

  // Cerrar con Escape, como el resto de los modales de la plataforma.
  useEffect(() => {
    if (!abierto) return;
    const alPresionar = (e) => { if (e.key === 'Escape') setAbierto(false); };
    window.addEventListener('keydown', alPresionar);
    return () => window.removeEventListener('keydown', alPresionar);
  }, [abierto]);

  const responder = useCallback(async (pregunta) => {
    const limpia = pregunta.trim();
    if (!limpia || cargando) return;

    setMensajes(prev => [...prev, { id: nuevoId(), autor: 'docente', texto: limpia }]);
    setTexto('');
    setCategoria(null);

    const coincidencias = buscarEnBase(limpia, 3);
    const mejor = coincidencias[0];

    // 1. Coincidencia clara: se responde de inmediato, sin gastar cupo de IA.
    if (mejor && mejor.puntaje >= UMBRAL_DIRECTO) {
      setMensajes(prev => [...prev, mensajeDesdeEntrada(mejor.entrada)]);
      return;
    }

    // 2. Sin coincidencia clara: la IA responde anclada a los fragmentos más cercanos.
    setCargando(true);
    try {
      const contexto = coincidencias.map(c => entradaComoContexto(c.entrada)).join('\n---\n');
      const { respuesta, origen } = await asistenteService.preguntar(limpia, contexto);
      setMensajes(prev => [...prev, {
        id: nuevoId(),
        autor: 'asistente',
        texto: respuesta,
        relacionados: coincidencias.map(c => c.entrada).slice(0, 2),
        origen: origen === 'cache' ? 'base' : 'ia',
      }]);
    } catch (e) {
      // 3. Respaldo: se ofrece lo más parecido de la base local antes que dejar al docente sin nada.
      setMensajes(prev => [...prev, {
        id: nuevoId(),
        autor: 'asistente',
        texto: mejor
          ? `No fue posible consultar la inteligencia artificial en este momento (${e.message}). Lo más cercano que encuentra el asistente es lo siguiente.`
          : `No fue posible consultar la inteligencia artificial en este momento (${e.message}). Puede reformular la pregunta o elegir uno de los temas disponibles.`,
        relacionados: coincidencias.map(c => c.entrada),
        origen: 'error',
      }]);
    } finally {
      setCargando(false);
    }
  }, [cargando]);

  const abrirEntrada = useCallback((entrada) => {
    setMensajes(prev => [
      ...prev,
      { id: nuevoId(), autor: 'docente', texto: entrada.pregunta },
      mensajeDesdeEntrada(entrada),
    ]);
    setCategoria(null);
  }, []);

  // Sin categoría elegida se ofrecen las preguntas de arranque; con categoría, todas las de ese tema.
  const sugerencias = categoria
    ? BASE_CONOCIMIENTO.filter(e => e.categoria === categoria)
    : SUGERENCIAS_INICIALES.map(entradaPorId).filter(Boolean);

  // Una vez iniciada la conversación las sugerencias ceden su espacio a los mensajes;
  // vuelven a mostrarse si el docente elige un tema.
  const mostrarSugerencias = categoria !== null || mensajes.length <= 1;

  const panel = (
    <>
      {/* Botón flotante */}
      <button
        onClick={() => setAbierto(v => !v)}
        aria-label={abierto ? 'Cerrar el asistente' : 'Abrir el asistente'}
        className={`fixed bottom-6 right-6 z-[60] flex items-center gap-2.5 rounded-full pl-4 pr-5 py-3.5
          bg-gradient-to-br from-magenta to-magenta-soft text-white font-semibold text-sm
          shadow-[0_10px_30px_-8px_rgba(230,0,126,0.6)] transition-all duration-300
          hover:shadow-[0_16px_40px_-10px_rgba(230,0,126,0.75)] hover:-translate-y-0.5
          ${abierto ? 'opacity-0 pointer-events-none translate-y-2' : 'opacity-100'}`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z" />
        </svg>
        <span className="hidden sm:inline">¿Necesita ayuda?</span>
      </button>

      {/* Panel */}
      {abierto && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-end p-0 sm:p-6 bg-ink/30 backdrop-blur-[2px] animate-fade-in"
          onClick={() => setAbierto(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="flex flex-col w-full sm:w-[420px] h-full sm:h-[640px] sm:max-h-[calc(100vh-3rem)]
              bg-white sm:rounded-2xl shadow-2xl border border-gray-200 overflow-hidden animate-slide-up"
          >
            {/* Encabezado */}
            <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-magenta to-magenta-soft text-white shrink-0">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-white/20 shrink-0">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z" />
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-[15px] font-bold leading-tight">Asistente del Observatorio</h3>
                <p className="text-[11.5px] text-white/80 leading-tight mt-0.5">Uso de la plataforma · Git y GitFlow</p>
              </div>
              <button
                onClick={() => setAbierto(false)}
                aria-label="Cerrar"
                className="grid place-items-center w-8 h-8 rounded-lg hover:bg-white/20 transition-colors shrink-0"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Conversación */}
            <div ref={conversacionRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-mist/40">
              {mensajes.map(m => (
                <Mensaje key={m.id} mensaje={m} onElegir={abrirEntrada} />
              ))}

              {cargando && (
                <div className="flex gap-1.5 items-center px-4 py-3 bg-white rounded-2xl rounded-tl-sm border border-gray-200 w-fit">
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-magenta/60 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Sugerencias */}
            <div className="px-4 pt-3 pb-1 border-t border-gray-100 bg-white shrink-0">
              <div className={`flex gap-1.5 ${mostrarSugerencias ? 'mb-2.5' : 'mb-1'}`}>
                {CATEGORIAS.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setCategoria(categoria === c.id ? null : c.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11.5px] font-semibold
                      transition-all duration-200 border
                      ${categoria === c.id
                        ? 'bg-magenta text-white border-magenta'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-magenta/40 hover:text-magenta'}`}
                  >
                    {ICONOS[c.id]}
                    {c.corto}
                  </button>
                ))}
              </div>

              {mostrarSugerencias && (
                <div className="flex flex-wrap gap-1.5 max-h-[96px] overflow-y-auto pb-2">
                  {sugerencias.map(e => (
                    <button
                      key={e.id}
                      onClick={() => abrirEntrada(e)}
                      className="text-left text-[11.5px] leading-snug px-2.5 py-1.5 rounded-lg bg-magenta-light
                        text-magenta-dark border border-magenta/15 hover:border-magenta/40 hover:bg-magenta/10
                        transition-all duration-200"
                    >
                      {e.pregunta}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Entrada de texto */}
            <form
              onSubmit={e => { e.preventDefault(); responder(texto); }}
              className="flex items-end gap-2 px-4 py-3 border-t border-gray-100 bg-white shrink-0"
            >
              <textarea
                ref={inputRef}
                rows={1}
                value={texto}
                onChange={e => setTexto(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); responder(texto); }
                }}
                placeholder="Escriba su pregunta..."
                className="flex-1 resize-none rounded-xl border border-gray-200 px-3.5 py-2.5 text-[13.5px]
                  max-h-24 focus:outline-none focus:border-magenta focus:ring-2 focus:ring-magenta/10 transition-all"
              />
              <button
                type="submit"
                disabled={!texto.trim() || cargando}
                aria-label="Enviar"
                className="grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-magenta to-magenta-soft
                  text-white shrink-0 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5
                  disabled:opacity-35 disabled:hover:translate-y-0 disabled:hover:shadow-none disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.9}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );

  return createPortal(panel, document.body);
}

function Mensaje({ mensaje, onElegir }) {
  const esDocente = mensaje.autor === 'docente';

  if (esDocente) {
    return (
      <div className="flex justify-end">
        <p className="max-w-[85%] px-3.5 py-2.5 rounded-2xl rounded-tr-sm bg-magenta text-white
          text-[13.5px] leading-relaxed shadow-sm">
          {mensaje.texto}
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-[92%] space-y-2">
        <div className="px-3.5 py-3 rounded-2xl rounded-tl-sm bg-white border border-gray-200 shadow-sm">
          <p className="text-[13.5px] leading-relaxed text-ink whitespace-pre-line">{mensaje.texto}</p>

          {mensaje.pasos && (
            <ol className="mt-3 pt-3 border-t border-dashed border-gray-200 space-y-1.5">
              {mensaje.pasos.map((p, i) => (
                <li key={i} className="flex gap-2.5 text-[12.5px] leading-snug text-gray-700">
                  <span className="grid place-items-center w-4 h-4 rounded-full bg-magenta-light text-magenta
                    text-[9.5px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                  {p}
                </li>
              ))}
            </ol>
          )}

          {mensaje.comandos && (
            <div className="mt-3 pt-3 border-t border-dashed border-gray-200 space-y-1.5">
              {mensaje.comandos.map((c, i) => (
                <div key={i}>
                  <code className="block text-[11.5px] font-mono bg-ink text-magenta-soft rounded-md px-2.5 py-1.5
                    overflow-x-auto whitespace-pre">{c.cmd}</code>
                  {c.nota && <p className="text-[11px] text-gray-500 mt-1 ml-0.5 leading-snug">{c.nota}</p>}
                </div>
              ))}
            </div>
          )}

          {mensaje.origen === 'ia' && (
            <p className="mt-3 pt-2.5 border-t border-dashed border-gray-200 text-[10.5px] text-gray-400 leading-snug">
              Respuesta elaborada con inteligencia artificial a partir de la información de la plataforma. Conviene verificarla ante cualquier duda.
            </p>
          )}
        </div>

        {mensaje.relacionados && mensaje.relacionados.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {mensaje.relacionados.map(e => (
              <button
                key={e.id}
                onClick={() => onElegir(e)}
                className="text-left text-[11px] leading-snug px-2.5 py-1.5 rounded-lg bg-white border border-gray-200
                  text-gray-600 hover:border-magenta/40 hover:text-magenta transition-all duration-200"
              >
                {e.pregunta}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
