import api from './api.js';

const API_TIMEOUT = 10000; // 10 segundos
const MAX_RETRIES = 2;

const fetchWithRetry = async (apiCall, retries = MAX_RETRIES) => {
  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // No reintentar en ciertos casos (errores 400, 401, 404)
      if (error.response && (error.response.status < 500 && error.response.status !== 429)) {
        throw error;
      }
      
      // Si no es el último intento, esperar antes de reintentar
      if (attempt < retries) {
        // Espera exponencial: 1s, 2s, 4s, etc.
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Reintentando petición en ${delay}ms (intento ${attempt + 1}/${retries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // Si llegamos aquí, todos los intentos fallaron
  throw lastError;
};

// Obtener todos los perfiles
export const getProfiles = async () => {
  try {
    const response = await fetchWithRetry(() => api.get('/profiles', { timeout: API_TIMEOUT }));
    return response.data;
  } catch (error) {
    handleProfileError(error, 'Error al obtener perfiles');
  }
};

// Obtener un perfil por ID
export const getProfileById = async (id) => {
  try {
    const response = await fetchWithRetry(() => api.get(`/profiles/${id}`, { timeout: API_TIMEOUT }));
    return response.data;
  } catch (error) {
    handleProfileError(error, 'Error al obtener perfil');
  }
};

// Crear un nuevo perfil
export const createProfile = async (profileData) => {
  try {
    const response = await fetchWithRetry(() => api.post('/profiles', profileData, { timeout: API_TIMEOUT }));
    return response.data;
  } catch (error) {
    handleProfileError(error, 'Error al crear perfil');
  }
};

// Actualizar un perfil
export const updateProfile = async (id, profileData) => {
  try {
    const response = await fetchWithRetry(() => api.put(`/profiles/${id}`, profileData, { timeout: API_TIMEOUT }));
    return response.data;
  } catch (error) {
    handleProfileError(error, 'Error al actualizar perfil');
  }
};

// Eliminar un perfil
export const deleteProfile = async (id) => {
  try {
    const response = await fetchWithRetry(() => api.delete(`/profiles/${id}`, { timeout: API_TIMEOUT }));
    return response.data;
  } catch (error) {
    handleProfileError(error, 'Error al eliminar perfil');
  }
};

// Obtener favoritos de un perfil
export const getProfileFavorites = async (id) => {
  try {
    const response = await fetchWithRetry(() => api.get(`/profiles/${id}/favorites`, { timeout: API_TIMEOUT }));
    return response.data;
  } catch (error) {
    handleProfileError(error, 'Error al obtener favoritos');
  }
};

// Añadir un personaje a favoritos
export const addFavorite = async (profileId, characterId) => {
  try {
    const response = await fetchWithRetry(() => 
      api.post(`/profiles/${profileId}/favorites/${characterId}`, {}, { timeout: API_TIMEOUT })
    );
    return response.data;
  } catch (error) {
    handleProfileError(error, 'Error al añadir a favoritos');
  }
};

// Eliminar un personaje de favoritos
export const removeFavorite = async (profileId, characterId) => {
  try {
    const response = await fetchWithRetry(() => 
      api.delete(`/profiles/${profileId}/favorites/${characterId}`, { timeout: API_TIMEOUT })
    );
    return response.data;
  } catch (error) {
    handleProfileError(error, 'Error al eliminar de favoritos');
  }
};

// Función centralizada para manejar errores de perfil
const handleProfileError = (error, defaultMessage) => {
  // Mejorar el mensaje de error según el tipo de problema
  if (error.code === 'ECONNABORTED') {
    throw new Error('Tiempo de espera agotado. El servidor no responde.');
  } else if (!error.response) {
    throw new Error('Error de conexión. Comprueba tu conexión a internet.');
  } else if (error.response.status === 503) {
    throw new Error('Servicio no disponible temporalmente. Intenta más tarde.');
  } else if (error.response.status === 500) {
    throw new Error('Error interno del servidor. Por favor, intenta más tarde.');
  } else if (error.response.status === 429) {
    throw new Error('Demasiadas solicitudes. Por favor, espera un momento y vuelve a intentarlo.');
  } else if (error.response.status === 404) {
    throw new Error('Perfil no encontrado.');
  } else {
    throw error.response?.data?.message || defaultMessage;
  }
};