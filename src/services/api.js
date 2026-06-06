async function request(url, options = {}) {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
  return data;
}

export const aportesService = {
  listar: (materiaId) =>
    request(materiaId ? `/api/aportes?materia=${materiaId}` : '/api/aportes'),
  guardar: (body) =>
    request('/api/aportes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
};

export const definicionService = {
  listar: () => request('/api/definicion'),
  guardar: (body) =>
    request('/api/definicion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
};

export const sintesisService = {
  generar: (materiaId) =>
    request('/api/sintesis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ materiaId }),
    }),
  verPrompt: (materiaId) =>
    request('/api/sintesis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ materiaId, soloPrompt: true }),
    }),
};

export const materiasService = {
  listar: () => request('/api/materias'),
  obtener: (id) => request(`/api/materias?id=${id}`),
  guardar: (body) =>
    request('/api/materias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
};

export const planeadoresService = {
  listar: (materiaId) => request(`/api/planeadores?materia=${materiaId}`),
  guardar: (body) =>
    request('/api/planeadores', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  backupEstado: (materiaId) => request(`/api/planeadores?action=backup&materia=${materiaId}`),
  guardarBackup: (materiaId) =>
    request(`/api/planeadores?action=backup&materia=${materiaId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save' }),
    }),
  restaurarBackup: (materiaId) =>
    request(`/api/planeadores?action=backup&materia=${materiaId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'restore' }),
    }),
};

export const integradoresService = {
  listar: () => request('/api/integradores'),
  porNivel: (nivel) => request(`/api/integradores?nivel=${nivel}`),
};

export const comentariosService = {
  listar: (materiaId) => request(`/api/planeadores?action=comentarios&materia=${materiaId}`),
  guardar: (body) =>
    request('/api/planeadores?action=comentarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
};

export const alineacionService = {
  obtener: (materiaId) => request(`/api/alineacion?materia=${materiaId}`),
};

export const recomendacionesService = {
  listar: (materiaId) => request(`/api/recomendaciones?materia=${materiaId}`),
  guardar: (materiaId, body) =>
    request(`/api/recomendaciones?materia=${materiaId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  restaurar: (materiaId, indice) =>
    request(`/api/recomendaciones?materia=${materiaId}&indice=${indice}`, { method: 'DELETE' }),
};

export const sugerenciasService = {
  listar: (materiaId) => request(`/api/sugerencias?materia=${materiaId}`),
  guardar: (body) =>
    request('/api/sugerencias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
  eliminar: (id) =>
    request(`/api/sugerencias?id=${id}`, { method: 'DELETE' }),
};

export const usuariosService = {
  listar: () => request('/api/usuarios'),
  guardar: (body) =>
    request('/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
};
