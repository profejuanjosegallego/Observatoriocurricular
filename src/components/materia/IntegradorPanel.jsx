import { useState } from 'react';
import { getMateria, getNivel } from '../../data/materias';
import { getPI } from '../../data/integradores';

const CAPA_ICONOS = {
  db: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  ui: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  code: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  api: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
  ),
  scrum: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  data: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
};

const NIVEL_COLORS = {
  1: { bg: 'from-indigo-500 to-indigo-600', accent: '#6366f1', light: 'bg-indigo-50', border: 'border-indigo-200' },
  2: { bg: 'from-magenta to-magenta-dark', accent: '#E6007E', light: 'bg-magenta/5', border: 'border-magenta/15' },
  3: { bg: 'from-emerald-500 to-emerald-600', accent: '#10b981', light: 'bg-emerald-50', border: 'border-emerald-200' },
};

function DiagramaNivel({ nivel, pi, colors, materiaId }) {
  const lider = getMateria(pi.lider);

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5">
      <h4 className="font-heading font-bold text-sm text-ink mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
        Diagrama de integración
      </h4>
      <div className="flex flex-col items-center gap-4">
        <div
          className={`w-52 rounded-xl p-4 text-center text-white font-bold text-sm transition-all duration-300 ${materiaId === pi.lider ? 'ring-4 ring-offset-2 scale-105' : ''}`}
          style={{
            background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}cc)`,
            '--tw-ring-color': colors.accent + '50',
          }}
        >
          <p className="text-[9px] uppercase tracking-wider opacity-70 mb-1">★ Líder</p>
          {lider?.nombre}
          <p className="text-[10px] font-normal opacity-80 mt-1">{pi.liderRol}</p>
        </div>

        <div className="flex items-center gap-8">
          {pi.apoyo.map((_, i) => (
            <svg key={i} className="w-5 h-10" viewBox="0 0 20 40"><path d="M10 0 L10 30 L5 25 M10 30 L15 25" stroke={colors.accent} strokeWidth="1.5" fill="none" /></svg>
          ))}
        </div>

        <div className="flex gap-4 flex-wrap justify-center">
          {pi.apoyo.map((a, i) => {
            const m = getMateria(a.materia);
            const isActive = materiaId === a.materia;
            return (
              <div
                key={i}
                className={`w-48 rounded-xl p-3 text-center border-2 transition-all duration-300 ${isActive ? 'ring-4 ring-offset-2 scale-105' : ''}`}
                style={{
                  borderColor: isActive ? colors.accent : colors.accent + '40',
                  backgroundColor: isActive ? colors.accent + '08' : 'transparent',
                  '--tw-ring-color': colors.accent + '50',
                }}
              >
                <p className="text-[9px] uppercase tracking-wider mb-1" style={{ color: colors.accent }}>● Apoyo</p>
                <p className="text-sm font-semibold text-ink">{m?.nombre}</p>
                <p className="text-[10px] text-ink-2 mt-1">{a.rol}</p>
              </div>
            );
          })}
        </div>

        <div className="w-full max-w-sm rounded-full py-2 px-4 text-center border-2 border-dashed" style={{ borderColor: colors.accent + '40', backgroundColor: colors.accent + '08' }}>
          <p className="text-xs font-semibold" style={{ color: colors.accent }}>
            {nivel === 1 ? 'Contrato: Modelo Relacional' : nivel === 2 ? 'Backlog + Sprints + Ceremonias' : 'Integración Full-Stack + GitFlow'}
          </p>
        </div>
      </div>
    </div>
  );
}

function AvanceCard({ av, idx, colors, materiaId }) {
  const pm = av.porMateria || {};
  const materiaEntrega = pm[materiaId];
  const otrasMaterias = Object.entries(pm).filter(([k]) => k !== materiaId && !k.startsWith('_'));
  const transversal = pm._transversal;

  return (
    <div className="relative pl-10">
      <div
        className="absolute left-2.5 top-3 w-3 h-3 rounded-full border-2 border-white"
        style={{ backgroundColor: colors.accent, boxShadow: `0 0 0 3px ${colors.accent}20` }}
      />
      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all duration-300">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: colors.accent + '12', color: colors.accent }}>
            Avance {idx + 1}
          </span>
          <span className="text-xs font-semibold" style={{ color: colors.accent }}>
            Semana {av.semana}
          </span>
          <span className="text-xs font-medium text-ink-2">— {av.nombre}</span>
        </div>

        {/* Entregable de la materia actual — destacado */}
        {materiaEntrega && (
          <div className="rounded-lg p-3 mb-3 border-2" style={{ borderColor: colors.accent + '40', backgroundColor: colors.accent + '06' }}>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-white px-1.5 py-0.5 rounded" style={{ backgroundColor: colors.accent }}>
                Tu módulo
              </span>
              <span className="text-xs font-bold" style={{ color: colors.accent }}>{getMateria(materiaId)?.nombre}</span>
            </div>
            <p className="text-sm font-semibold text-ink mb-1">{materiaEntrega.titulo}</p>
            <p className="text-xs text-ink-2 leading-relaxed">{materiaEntrega.detalle}</p>
          </div>
        )}

        {/* Entregables de las otras materias — compactos */}
        {otrasMaterias.length > 0 && (
          <div className="space-y-2">
            {otrasMaterias.map(([mid, ent]) => {
              const m = getMateria(mid);
              return (
                <div key={mid} className="rounded-lg p-2.5 bg-white border border-gray-100">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] font-bold" style={{ color: colors.accent }}>●</span>
                    <span className="text-[11px] font-semibold text-ink-2">{m?.nombre}</span>
                  </div>
                  <p className="text-xs font-medium text-ink">{ent.titulo}</p>
                  <p className="text-[11px] text-ink-2 leading-relaxed mt-0.5">{ent.detalle}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Transversal */}
        {transversal && (
          <div className="mt-2 rounded-lg p-2.5 bg-amber-50 border border-amber-200/50">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[9px] font-bold text-amber-700">◆</span>
              <span className="text-[11px] font-semibold text-amber-700">Transversal (todos los módulos)</span>
            </div>
            <p className="text-xs font-medium text-amber-800">{transversal.titulo}</p>
            <p className="text-[11px] text-amber-700 leading-relaxed mt-0.5">{transversal.detalle}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function IntegradorPanel({ nivel, materiaId }) {
  const pi = getPI(nivel);
  const nv = getNivel(nivel);
  const colors = NIVEL_COLORS[nivel];

  if (!pi) {
    return (
      <div className="text-center py-10 text-ink-2 animate-fade-in">
        <p className="text-sm">No se ha configurado el proyecto integrador para este nivel.</p>
      </div>
    );
  }

  const liderMateria = getMateria(pi.lider);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Hero */}
      <div className={`bg-gradient-to-r ${colors.bg} rounded-2xl p-6 text-white relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[10px] font-bold tracking-wider uppercase bg-white/15 backdrop-blur px-2.5 py-1 rounded-full">
              {nv?.nombre}
            </span>
            <span className="text-[10px] font-bold tracking-wider uppercase bg-white/15 backdrop-blur px-2.5 py-1 rounded-full">
              Modelo {pi.modelo}
            </span>
          </div>
          <h3 className="font-heading font-bold text-xl mt-2">{pi.titulo}</h3>
          <p className="text-white/80 text-sm mt-2 max-w-2xl leading-relaxed">{pi.objetivo}</p>
        </div>
      </div>

      {/* Concepto central */}
      <div className={`${colors.light} border ${colors.border} rounded-xl p-5`}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: colors.accent + '15' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: colors.accent }}>Concepto central</p>
            <h4 className="font-heading font-bold text-base text-ink mb-1">{pi.concepto}</h4>
            <p className="text-sm text-ink-2 leading-relaxed">{pi.conceptoDetalle}</p>
          </div>
        </div>
      </div>

      {/* Diagrama — justo después del concepto */}
      <DiagramaNivel nivel={nivel} pi={pi} colors={colors} materiaId={materiaId} />

      {/* Arquitectura + Roles en grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h4 className="font-heading font-bold text-sm text-ink mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Arquitectura del proyecto
          </h4>
          <div className="space-y-3">
            {pi.capas.map((c, i) => {
              const m = getMateria(c.materia);
              const isActive = c.materia === materiaId;
              return (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${isActive ? '' : 'hover:bg-gray-50'}`} style={isActive ? { backgroundColor: colors.accent + '08', borderLeft: `3px solid ${c.color}` } : {}}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: c.color + '15', color: c.color }}>
                    {CAPA_ICONOS[c.icono] || CAPA_ICONOS.code}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold" style={{ color: c.color }}>{c.nombre}</p>
                    <p className="text-[11px] text-ink-2 leading-relaxed">{c.descripcion}</p>
                    <p className="text-[10px] text-ink-2/60 mt-0.5">{m?.nombre}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h4 className="font-heading font-bold text-sm text-ink mb-3 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Roles de los módulos
          </h4>

          <div className="p-3 rounded-lg mb-3" style={{ backgroundColor: colors.accent + '08', borderLeft: `3px solid ${colors.accent}` }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-bold" style={{ color: colors.accent }}>★</span>
              <span className="text-xs font-bold" style={{ color: colors.accent }}>{pi.liderRol}</span>
              <span className="text-[10px] font-semibold text-white px-1.5 py-0.5 rounded-full" style={{ backgroundColor: colors.accent }}>Líder</span>
            </div>
            <p className="text-sm font-semibold text-ink">{liderMateria?.nombre}</p>
            <p className="text-xs text-ink-2 mt-1 leading-relaxed">{pi.liderRazon}</p>
          </div>

          <div className="space-y-2">
            {pi.apoyo.map((a, i) => {
              const m = getMateria(a.materia);
              return (
                <div key={i} className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold" style={{ color: colors.accent }}>●</span>
                    <span className="text-xs font-semibold text-ink-2">{a.rol}</span>
                  </div>
                  <p className="text-sm font-medium text-ink">{m?.nombre}</p>
                  <p className="text-xs text-ink-2 mt-0.5 leading-relaxed">{a.descripcion}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200/50">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-700 mb-1">Mecanismo de integración</p>
            <p className="text-xs text-amber-800 leading-relaxed">{pi.integracion}</p>
          </div>
        </div>
      </div>

      {/* Timeline de avances — con zoom por materia */}
      {pi.avances && (
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h4 className="font-heading font-bold text-sm text-ink mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" style={{ color: colors.accent }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
            Hitos de entrega — {getMateria(materiaId)?.nombre}
          </h4>
          <div className="relative">
            <div className="absolute left-4 top-6 bottom-6 w-0.5" style={{ backgroundColor: colors.accent + '30' }} />
            <div className="space-y-4">
              {pi.avances.map((av, i) => (
                <AvanceCard key={i} av={av} idx={i} colors={colors} materiaId={materiaId} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
