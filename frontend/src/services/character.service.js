import api from './api.js';

// Configuración para reintentos
const MAX_RETRIES = 2;
const API_TIMEOUT = 15000; 

// Función de reintento para peticiones que pueden fallar
const fetchWithRetry = async (apiCall, retries = MAX_RETRIES) => {
  let lastError;
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      
      // No reintentar en ciertos casos (errores 400, 401, 404 excepto por recursos insuficientes)
      if (error.response && 
          (error.response.status < 500 && 
           error.response.status !== 429 && 
           !error.response.data?.message?.includes('INSUFFICIENT_RESOURCES'))) {
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

// Obtener todos los personajes con filtros opcionales
export const getCharacters = async (params = {}) => {
  try {
    const response = await fetchWithRetry(() => 
      api.get('/characters', { 
        params,
        timeout: API_TIMEOUT 
      })
    );
    return response.data;
  } catch (error) {
    console.error('Error getCharacters:', error);
    if (error.code === 'ECONNABORTED') {
      throw 'Tiempo de espera agotado. El servidor podría estar sobrecargado.';
    } else if (!error.response) {
      throw 'Error de conexión. Comprueba tu conexión a internet.';
    } else {
      throw error.response?.data?.message || 'Error al obtener personajes';
    }
  }
};

// Obtener un personaje por ID
export const getCharacterById = async (id, profileId = null) => {
  try {
    const params = profileId ? { profileId } : {};
    const response = await fetchWithRetry(() => 
      api.get(`/characters/${id}`, { 
        params,
        timeout: API_TIMEOUT 
      })
    );
    return response.data;
  } catch (error) {
    console.error('Error getCharacterById:', error);
    throw error.response?.data?.message || 'Error al obtener personaje';
  }
};

// Crear un nuevo personaje
export const createCharacter = async (characterData) => {
  try {
    const response = await fetchWithRetry(() => 
      api.post('/characters', characterData, { timeout: API_TIMEOUT })
    );
    return response.data;
  } catch (error) {
    console.error('Error createCharacter:', error);
    throw error.response?.data?.message || 'Error al crear personaje';
  }
};

// Actualizar un personaje
export const updateCharacter = async (id, characterData) => {
  try {
    const response = await fetchWithRetry(() => 
      api.put(`/characters/${id}`, characterData, { timeout: API_TIMEOUT })
    );
    return response.data;
  } catch (error) {
    console.error('Error updateCharacter:', error);
    throw error.response?.data?.message || 'Error al actualizar personaje';
  }
};

// Eliminar un personaje
export const deleteCharacter = async (id) => {
  try {
    const response = await fetchWithRetry(() => 
      api.delete(`/characters/${id}`, { timeout: API_TIMEOUT })
    );
    return response.data;
  } catch (error) {
    console.error('Error deleteCharacter:', error);
    throw error.response?.data?.message || 'Error al eliminar personaje';
  }
};

// Función auxiliar para procesar la respuesta de personajes aleatorios
const processRandomCharactersResponse = (data) => {
  // Si la respuesta ya es un array, verificamos que cada elemento tenga _id
  if (Array.isArray(data)) {
    return data.map(char => {
      // Si ya tiene _id, lo dejamos como está
      if (char._id) return char;
      
      // Si es un personaje de la API (tiene apiId), le creamos un _id en formato "api-X"
      if (char.apiId) {
        return { ...char, _id: `api-${char.apiId}` };
      }
      
      // Si tiene id pero no _id, usamos el id como _id
      if (char.id) {
        return { ...char, _id: char.id };
      }
      
      // Si no tiene ningún identificador, generamos uno aleatorio
      return {
        ...char,
        _id: `random-${Math.random().toString(36).substring(2, 11)}`
      };
    });
  }
  
  // Si la respuesta es un objeto único, lo convertimos en array
  if (data && typeof data === 'object') {
    const char = data;
    // Aplicamos la misma lógica que arriba para asignar _id
    if (!char._id) {
      if (char.apiId) {
        char._id = `api-${char.apiId}`;
      } else if (char.id) {
        char._id = char.id;
      } else {
        char._id = `random-${Math.random().toString(36).substring(2, 11)}`;
      }
    }
    return [char];
  }
  
  // Si la respuesta no es ni array ni objeto, devolvemos array vacío
  return [];
};

// Modifica la función getRandomCharacters original, reemplazando el return response.data por:
export const getRandomCharacters = async (count = 5, profileId = null) => {
  try {
    const params = { count };
    if (profileId) params.profileId = profileId;
    
    const response = await fetchWithRetry(() => 
      api.get('/characters/random', { 
        params,
        timeout: API_TIMEOUT 
      })
    );
    
    // Procesamos la respuesta para asegurar el formato correcto
    return processRandomCharactersResponse(response.data);
  } catch (error) {
    console.error('Error getRandomCharacters:', error);
    if (error.code === 'ECONNABORTED') {
      throw 'Tiempo de espera agotado. El servidor podría estar sobrecargado.';
    } else if (!error.response) {
      throw 'Error de conexión. Comprueba tu conexión a internet.';
    } else if (error.response.status === 503 || error.response.status === 429) {
      throw 'Servicio no disponible temporalmente. Intenta más tarde.';
    } else {
      throw error.response?.data?.message || 'Error al obtener personajes aleatorios';
    }
  }
};

// Buscar personajes por nombre
export const searchCharacters = async (name, profileId = null, showAll = false) => {
  try {
    const params = { 
      name,
      showAll
    };
    if (profileId) params.profileId = profileId;
    
    const response = await fetchWithRetry(() => 
      api.get('/characters/search', { 
        params,
        timeout: API_TIMEOUT 
      })
    );
    return response.data;
  } catch (error) {
    console.error('Error searchCharacters:', error);
    throw error.response?.data?.message || 'Error al buscar personajes';
  }
};