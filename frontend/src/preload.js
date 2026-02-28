const { contextBridge } = require('electron');

const BASE_URL = 'http://localhost:3000';

/* ================================
   FUNCIÓN GENÉRICA FETCH
================================ */
async function apiRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    // Validar errores HTTP
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Error ${response.status}: ${errorText}`
      );
    }

    // Si no hay contenido
    if (response.status === 204) return null;

    return await response.json();

  } catch (error) {
    console.error('API ERROR:', error);
    throw error;
  }
}

/* ================================
   EXPONER API AL RENDERER
================================ */
contextBridge.exposeInMainWorld('educacionApp', {

  /* ---------- TUTORES ---------- */

  getTutores: () =>
    apiRequest('/api/tutores'),

  createTutor: (data) =>
    apiRequest('/api/tutores', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  deleteTutor: (id) =>
    apiRequest(`/api/tutores/${id}`, {
      method: 'DELETE'
    }),

  updateTutor: (id, data) =>
    apiRequest(`/api/tutores/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  /* ---------- ESTUDIANTES ---------- */

  getEstudiantes: () =>
    apiRequest('/api/estudiantes'),

  createEstudiante: (data) =>
    apiRequest('/api/estudiantes', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateEstudiante: (id, data) =>
    apiRequest(`/api/estudiantes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    }),

  deleteEstudiante: (id) =>
    apiRequest(`/api/estudiantes/${id}`, {
      method: 'DELETE'
    }),
  // alias en español (renderer usa eliminarEstudiante)
  eliminarEstudiante: (id) =>
    apiRequest(`/api/estudiantes/${id}`, { method: 'DELETE' }),

  /* ---------- GRADOS ---------- */
  getGrados: () =>
    apiRequest('/api/grados'),

  createGrado: (data) =>
    apiRequest('/api/grados', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateGrado: (id, data) =>
    apiRequest(`/api/grados/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGrado: (id) =>
    apiRequest(`/api/grados/${id}`, { method: 'DELETE' }),

  /* ---------- GRUPOS ---------- */
  getGrupos: () =>
    apiRequest('/api/grupos'),

  createGrupo: (data) =>
    apiRequest('/api/grupos', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  updateGrupo: (id, data) =>
    apiRequest(`/api/grupos/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteGrupo: (id) =>
    apiRequest(`/api/grupos/${id}`, { method: 'DELETE' }),

  /* ---------- MAESTROS ---------- */
  getMaestros: () =>
    apiRequest('/api/maestros'),

  createMaestro: (data) =>
    apiRequest('/api/maestros', {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  updateMaestro: (id, data) =>
    apiRequest(`/api/maestros/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteMaestro: (id) =>
    apiRequest(`/api/maestros/${id}`, { method: 'DELETE' }),
  /* ---------- INCIDENCIAS ---------- */
  getIncidenciasByEstudiante: (estudianteId) =>
    apiRequest(`/api/incidencias/estudiante/${estudianteId}`),

  getIncidencias: () =>
    apiRequest('/api/incidencias'),

  createIncidencia: (data) =>
    apiRequest('/api/incidencias', { method: 'POST', body: JSON.stringify(data) }),

  updateIncidencia: (id, data) =>
    apiRequest(`/api/incidencias/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  deleteIncidencia: (id) =>
    apiRequest(`/api/incidencias/${id}`, { method: 'DELETE' }),

  /* ---------- NOTIFICACIONES ---------- */

  showNotification: (message) => {
    if (Notification.isSupported()) {
      new Notification('📚 Plataforma Educativa', {
        body: message
      });
    } else {
      console.warn('Notificaciones no soportadas');
    }
  }

});



