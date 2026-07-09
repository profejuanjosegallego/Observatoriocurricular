import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext(null);

const STORAGE_KEY = 'matriz_consultor_user';

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    // La sesión se conserva mientras el navegador siga abierto (sessionStorage):
    // sobrevive a las recargas, pero se cierra al cerrar el navegador. No se usa
    // localStorage para no dejar la sesión abierta indefinidamente en equipos compartidos.
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    // Limpiamos cualquier sesión persistida por versiones anteriores en localStorage.
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* noop */ }

    if (user) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = (nombre, rol) => {
    const u = { nombre, rol };
    setUser(u);
    fetch('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(u),
    }).catch(() => {});
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser debe usarse dentro de UserProvider');
  return ctx;
}
