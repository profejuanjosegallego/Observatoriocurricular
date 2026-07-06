import { useState } from 'react';
import { useUser } from '../../context/UserContext';

const ROLES = [
  { value: 'docente',      label: 'Docente' },
  { value: 'experto',      label: 'Experto externo' },
  { value: 'coordinador',  label: 'Coordinador académico' },
  { value: 'admin',        label: 'Administrador' },
  { value: 'superadmin',   label: 'Super administrador' },
];

// Credenciales del super administrador (perfil con permiso para incluir sugerencias en el planeador).
const SUPER_ADMIN = { usuario: 'superadmin', clave: 'cesde2026' };

export default function RoleSelector({ open, onClose }) {
  const { user, login } = useUser();
  const [nombre, setNombre] = useState(user?.nombre || '');
  const [rol, setRol] = useState(user?.rol || 'docente');
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const esSuper = rol === 'superadmin';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (esSuper) {
      if (usuario.trim() !== SUPER_ADMIN.usuario || clave !== SUPER_ADMIN.clave) {
        setError('Usuario o contraseña incorrectos.');
        return;
      }
      login('Super administrador', 'superadmin');
      setUsuario('');
      setClave('');
      onClose();
      return;
    }

    const trimmed = nombre.trim();
    if (!trimmed) return;
    login(trimmed, rol);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-2xl shadow-magenta/20 p-8 w-full max-w-md mx-4 animate-slide-up"
      >
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-magenta to-magenta-soft grid place-items-center text-white font-extrabold text-2xl mx-auto mb-5 shadow-lg shadow-magenta/30">
          O
        </div>
        <h2 className="text-xl font-bold text-center mb-1 font-heading">
          Observatorio Curricular
        </h2>
        <p className="text-sm text-ink-2 text-center mb-6">
          Identifíquese para comenzar a contribuir.
        </p>

        <label className="block text-sm font-semibold mb-1.5">Rol</label>
        <select
          value={rol}
          onChange={(e) => { setRol(e.target.value); setError(''); }}
          className="w-full mb-4 px-4 py-2.5 rounded-xl border border-magenta/15 bg-mist text-sm focus:outline-none focus:border-magenta focus:bg-white focus:ring-2 focus:ring-magenta/10 transition-all duration-300 cursor-pointer"
        >
          {ROLES.map(r => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>

        {esSuper ? (
          <>
            <label className="block text-sm font-semibold mb-1.5">Usuario</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => { setUsuario(e.target.value); setError(''); }}
              placeholder="Usuario del super administrador"
              autoComplete="username"
              className="w-full mb-4 px-4 py-2.5 rounded-xl border border-magenta/15 bg-mist text-sm focus:outline-none focus:border-magenta focus:bg-white focus:ring-2 focus:ring-magenta/10 transition-all duration-300"
            />

            <label className="block text-sm font-semibold mb-1.5">Contraseña</label>
            <input
              type="password"
              value={clave}
              onChange={(e) => { setClave(e.target.value); setError(''); }}
              placeholder="Contraseña"
              autoComplete="current-password"
              className="w-full mb-2 px-4 py-2.5 rounded-xl border border-magenta/15 bg-mist text-sm focus:outline-none focus:border-magenta focus:bg-white focus:ring-2 focus:ring-magenta/10 transition-all duration-300"
            />

            {error && (
              <p className="text-xs text-red-600 mb-4 flex items-center gap-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </p>
            )}
            {!error && <div className="mb-4" />}
          </>
        ) : (
          <>
            <label className="block text-sm font-semibold mb-1.5">Nombre completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ingrese su nombre completo"
              required
              className="w-full mb-6 px-4 py-2.5 rounded-xl border border-magenta/15 bg-mist text-sm focus:outline-none focus:border-magenta focus:bg-white focus:ring-2 focus:ring-magenta/10 transition-all duration-300"
            />
          </>
        )}

        <button
          type="submit"
          className="w-full py-3 rounded-full bg-gradient-to-r from-magenta to-magenta-dark text-white font-heading font-semibold text-sm shadow-lg shadow-magenta/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
        >
          Continuar
        </button>

        {user && (
          <button
            type="button"
            onClick={onClose}
            className="w-full mt-3 py-2.5 rounded-full border border-magenta/15 text-ink-2 text-sm font-medium hover:border-magenta hover:text-magenta transition-all duration-300 cursor-pointer"
          >
            Cancelar
          </button>
        )}
      </form>
    </div>
  );
}
