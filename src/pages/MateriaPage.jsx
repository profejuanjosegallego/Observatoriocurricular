import { useState, useEffect } from 'react';
import { useParams, useOutletContext, Link } from 'react-router-dom';
import { getMateria } from '../data/materias';
import { aportesService, definicionService, materiasService, sugerenciasService, recomendacionesService } from '../services/api';
import { useUser } from '../context/UserContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MateriaFicha from '../components/materia/MateriaFicha';
import AporteCard from '../components/materia/AporteCard';
import AporteForm from '../components/materia/AporteForm';
import SintesisPanel from '../components/materia/SintesisPanel';
import SugerenciasForm from '../components/materia/SugerenciasForm';
import PlaneadorTable from '../components/planeador/PlaneadorTable';
import IntegradorPanel from '../components/materia/IntegradorPanel';
import BootcampPanel from '../components/materia/BootcampPanel';
import BootcampGenerador from '../components/materia/BootcampGenerador';

const TABS = [
  { id: 'ficha',      label: 'Ficha general' },
  { id: 'aportes',    label: 'Aportes de saberes' },
  { id: 'planeador',  label: 'Planeador semanal' },
  { id: 'integrador', label: 'Integrador' },
  { id: 'bootcamp',   label: 'Bootcamp' },
];

export default function MateriaPage() {
  const { materiaId } = useParams();
  const { refreshCounts } = useOutletContext();
  const { user } = useUser();
  const m = getMateria(materiaId);

  const [tab, setTab] = useState('ficha');
  const [aportes, setAportes] = useState([]);
  const [definiciones, setDefiniciones] = useState({});
  const [materiaData, setMateriaData] = useState(null);
  const [sugerencias, setSugerencias] = useState([]);
  const [recOverrides, setRecOverrides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bootcampGenOpen, setBootcampGenOpen] = useState(false);

  function cargarDatos() {
    setLoading(true);
    Promise.all([
      aportesService.listar(materiaId),
      definicionService.listar(),
      materiasService.obtener(materiaId).catch(() => null),
      sugerenciasService.listar(materiaId).catch(() => []),
      recomendacionesService.listar(materiaId).catch(() => []),
    ])
      .then(([a, d, md, sg, ro]) => {
        setAportes(a);
        const defs = {};
        d.forEach(x => { defs[x.materiaId] = x.definicion; });
        setDefiniciones(defs);
        setMateriaData(md);
        setSugerencias(sg);
        setRecOverrides(ro);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => { cargarDatos(); }, [materiaId]);

  async function handleSaveAporte(body) {
    await aportesService.guardar(body);
    const updated = await aportesService.listar(materiaId);
    setAportes(updated);
    refreshCounts?.();
  }

  async function handleEditRecomendacion(indice, datos) {
    await recomendacionesService.guardar(materiaId, { indice, accion: 'editado', usuario: user?.nombre || '', ...datos });
    const updated = await recomendacionesService.listar(materiaId);
    setRecOverrides(updated);
  }

  async function handleDeleteRecomendacion(indice) {
    await recomendacionesService.guardar(materiaId, { indice, accion: 'eliminado', usuario: user?.nombre || '' });
    const updated = await recomendacionesService.listar(materiaId);
    setRecOverrides(updated);
  }

  async function handleRestoreRecomendacion(indice) {
    await recomendacionesService.restaurar(materiaId, indice);
    const updated = await recomendacionesService.listar(materiaId);
    setRecOverrides(updated);
  }

  async function handleSaveSugerencia(body) {
    await sugerenciasService.guardar(body);
    const updated = await sugerenciasService.listar(materiaId);
    setSugerencias(updated);
  }

  async function handleDeleteSugerencia(id) {
    await sugerenciasService.eliminar(id);
    const updated = await sugerenciasService.listar(materiaId);
    setSugerencias(updated);
  }

  function handleFichaUpdate() {
    materiasService.obtener(materiaId).then(md => setMateriaData(md)).catch(() => {});
  }

  if (!m) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <p className="text-ink-2">La materia solicitada no fue encontrada.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header de materia */}
      <div className="mb-5">
        <span className="inline-block text-[0.68rem] font-bold tracking-wider uppercase text-white bg-gradient-to-r from-magenta to-magenta-dark px-3 py-1 rounded-full">
          {m.nivelNombre}
        </span>
        <h2 className="text-2xl font-bold font-heading mt-2 tracking-tight">{m.nombre}</h2>
        <p className="text-sm text-ink-2 mt-1">
          {aportes.length} aporte{aportes.length !== 1 ? 's' : ''} registrado{aportes.length !== 1 ? 's' : ''} · Bootcamp: <strong>{m.bootcamp}</strong>
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-magenta/12 mb-6 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-300 border-b-2 cursor-pointer ${
              tab === t.id
                ? 'border-magenta text-magenta font-semibold'
                : 'border-transparent text-ink-2 hover:text-magenta hover:border-magenta/30'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="space-y-6">
          {tab === 'ficha' && (
            <MateriaFicha
              materiaId={materiaId}
              materiaData={materiaData}
              sugerenciasDocentes={sugerencias}
              recOverrides={recOverrides}
              onEditRec={handleEditRecomendacion}
              onDeleteRec={handleDeleteRecomendacion}
              onRestoreRec={handleRestoreRecomendacion}
              onSaveSugerencia={handleSaveSugerencia}
              onDeleteSugerencia={handleDeleteSugerencia}
              onUpdate={handleFichaUpdate}
            />
          )}

          {tab === 'aportes' && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-5 rounded bg-gradient-to-b from-magenta to-magenta-soft" />
                <h3 className="font-heading font-semibold text-base">Aportes de los docentes y expertos</h3>
              </div>

              {aportes.length === 0 ? (
                <div className="text-center py-8 bg-mist border border-dashed border-magenta/15 rounded-xl text-sm text-ink-2">
                  Aún no se han registrado aportes para este submódulo.
                </div>
              ) : (
                <div className="space-y-4">
                  {aportes.map(a => (
                    <AporteCard key={a._id || a.profesor} aporte={a} onSave={handleSaveAporte} />
                  ))}
                </div>
              )}

              <AporteForm
                materiaId={materiaId}
                aportes={aportes}
                onSave={handleSaveAporte}
              />

              <div className="flex items-center gap-2 mt-8 mb-2">
                <div className="w-2 h-5 rounded bg-gradient-to-b from-amber-400 to-orange-400" />
                <h3 className="font-heading font-semibold text-base">Sugerencias para el planeador</h3>
              </div>
              <p className="text-xs text-ink-2 mb-3">
                Proponga ajustes concretos al planeador semanal que aumenten la alineación curricular. Indique la semana, el título del ajuste y una justificación breve. Sus sugerencias se reflejarán en la ficha general.
              </p>
              <SugerenciasForm
                materiaId={materiaId}
                sugerencias={sugerencias}
                onSave={handleSaveSugerencia}
                onDelete={handleDeleteSugerencia}
              />

              <div className="flex items-center gap-2 mt-8 mb-2">
                <div className="w-2 h-5 rounded bg-gradient-to-b from-magenta to-magenta-soft" />
                <h3 className="font-heading font-semibold text-base">Definición única del consultor (construcción colectiva)</h3>
              </div>
              <SintesisPanel
                materiaId={materiaId}
                materiaName={m.nombre}
                definicion={definiciones[materiaId]}
                onFichaActualizada={handleFichaUpdate}
              />
            </>
          )}

          {tab === 'planeador' && (
            <>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-5 rounded bg-gradient-to-b from-magenta to-magenta-soft" />
                <h3 className="font-heading font-semibold text-base">Planeador semanal — 18 semanas</h3>
              </div>
              <PlaneadorTable materiaId={materiaId} />
            </>
          )}

          {tab === 'integrador' && (
            <>
              <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-5 rounded bg-gradient-to-b from-magenta to-magenta-soft" />
                  <h3 className="font-heading font-semibold text-base">Proyecto integrador — {m.bootcamp}</h3>
                </div>
                <Link
                  to="/generador"
                  className="flex items-center gap-2 bg-gradient-to-r from-magenta to-magenta-dark text-white text-sm font-medium px-4 py-2 rounded-xl shadow-lg shadow-magenta/30 hover:scale-[1.02] transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Diseñar PI con IA
                </Link>
              </div>
              <IntegradorPanel nivel={m.nivel} materiaId={materiaId} />
            </>
          )}

          {tab === 'bootcamp' && (
            <>
              <div className="flex items-center justify-between gap-4 mb-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-5 rounded bg-gradient-to-b from-magenta to-magenta-soft" />
                  <h3 className="font-heading font-semibold text-base">Bootcamp — {m.bootcamp}</h3>
                </div>
                <button
                  onClick={() => setBootcampGenOpen(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-magenta to-magenta-dark text-white text-sm font-medium px-4 py-2 rounded-xl shadow-lg shadow-magenta/30 hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Generar con IA
                </button>
              </div>
              <BootcampPanel nivel={m.nivel} />
              <BootcampGenerador
                nivel={m.nivel}
                open={bootcampGenOpen}
                onClose={() => setBootcampGenOpen(false)}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
