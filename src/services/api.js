async function request(url, options = {}) {
  const res = await fetch(url, options);
  // Se lee como texto para tolerar respuestas vacías o no-JSON (p. ej. un timeout del proxy),
  // que de otro modo harían fallar res.json() con "Unexpected end of JSON input".
  const texto = await res.text();
  let data = null;
  if (texto) {
    try {
      data = JSON.parse(texto);
    } catch {
      throw new Error(`El servidor devolvió una respuesta no válida (HTTP ${res.status}). Intente de nuevo.`);
    }
  }
  if (!res.ok) throw new Error((data && data.error) || `Error ${res.status}`);
  if (data === null) throw new Error('El servidor no devolvió datos. Intente de nuevo.');
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
  clasificarSugerencia: (materiaId, texto) =>
    request('/api/sintesis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ materiaId, clasificar: true, texto }),
    }),
  viabilidad: (materiaId, propuestas) =>
    request('/api/sintesis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ materiaId, viabilidad: true, propuestas }),
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

export const necesidadesService = {
  listar: () => request('/api/sugerencias?banco=1'),
  guardar: (body) =>
    request('/api/sugerencias?banco=1', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...body, banco: true }),
    }),
  eliminar: (id) =>
    request(`/api/sugerencias?banco=1&id=${id}`, { method: 'DELETE' }),
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

// Asistente del inicio. Reutiliza /api/generador con tipo 'chat' para no crear
// una función serverless nueva (el plan Hobby de Vercel admite 12 y ya están las 12).
export const asistenteService = {
  preguntar: (pregunta, contexto) =>
    request('/api/generador', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tipo: 'chat', pregunta, contexto }),
    }),
};
