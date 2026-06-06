import { useState } from 'react';
import { sintesisService, definicionService, materiasService } from '../../services/api';

export default function SintesisPanel({ materiaId, materiaName, definicion: defInicial, onFichaActualizada }) {
  const [definicion, setDefinicion] = useState(defInicial || '');
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msgAi, setMsgAi] = useState({ text: '', ok: false });
  const [msgDef, setMsgDef] = useState({ text: '', ok: false });

  async function generarSintesis() {
    setGenerating(true);
    setMsgAi({ text: 'Generando con IA…', ok: false });
    try {
      const data = await sintesisService.generar(materiaId);
      setDefinicion(data.sintesis);
      setMsgAi({ text: '✓ Propuesta generada. Revísela, ajústela y guárdela.', ok: true });
    } catch (err) {
      setMsgAi({ text: `✗ ${err.message}`, ok: false });
    } finally {
      setGenerating(false);
    }
  }

  async function guardarDefinicion(e) {
    e.preventDefault();
    setSaving(true);
    setMsgDef({ text: 'Guardando…', ok: false });
    try {
      await definicionService.guardar({ materiaId, definicion });

      await materiasService.guardar({
        materiaId,
        definicionSintesis: definicion,
      }).catch(() => {});

      onFichaActualizada?.();
      setMsgDef({ text: '✓ Definición guardada. Los campos de la ficha general fueron actualizados.', ok: true });
    } catch (err) {
      setMsgDef({ text: `✗ ${err.message}`, ok: false });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-gradient-to-br from-magenta/5 to-magenta-soft/8 border border-magenta/12 rounded-2xl p-5 animate-fade-in">
      <p className="text-sm text-ink-2 mb-3">
        Se genera una propuesta de síntesis con <strong>IA</strong> a partir de los aportes
        registrados. El equipo puede revisar y editar el resultado antes de guardarlo.
      </p>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <button
          onClick={generarSintesis}
          disabled={generating}
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-purple-700 to-magenta text-white font-heading font-semibold text-sm shadow-lg shadow-magenta/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-wait cursor-pointer"
        >
          Generar síntesis con IA
        </button>
        {msgAi.text && (
          <span className={`text-sm font-semibold ${msgAi.ok ? 'text-ok' : 'text-magenta-dark'}`}>
            {msgAi.text}
          </span>
        )}
      </div>

      <form onSubmit={guardarDefinicion}>
        <label className="block text-sm font-semibold mb-1.5">
          Síntesis acordada por el equipo para <strong>{materiaName}</strong>
        </label>
        <textarea
          value={definicion}
          onChange={e => setDefinicion(e.target.value)}
          placeholder="Redacten aquí la definición unificada que servirá de base para los ajustes del programa…"
          rows={6}
          className="w-full px-4 py-2.5 rounded-xl border border-magenta/15 bg-white text-sm resize-y focus:outline-none focus:border-magenta focus:ring-2 focus:ring-magenta/10 transition-all duration-300 mb-4"
        />
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="px-7 py-3 rounded-full bg-gradient-to-r from-magenta to-magenta-dark text-white font-heading font-semibold text-sm shadow-lg shadow-magenta/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-wait cursor-pointer"
          >
            Guardar definición
          </button>
          {msgDef.text && (
            <span className={`text-sm font-semibold ${msgDef.ok ? 'text-ok' : 'text-magenta-dark'}`}>
              {msgDef.text}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
