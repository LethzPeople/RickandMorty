import axios from 'axios';
import { getToken, removeToken } from '../utils/token-helpers';
import { toast } from 'react-toastify';

// Crear instancia base de Axios
const API_URL = import.meta.env.VITE_API_URL || 'https://rickandmorty-0qq7.onrender.com';

// Configuración por defecto
const DEFAULT_TIMEOUT = 15000; // 15 segundos de timeout por defecto

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: DEFAULT_TIMEOUT
});

// Utilidad para debugear API calls en desarrollo
const isDevMode = import.meta.env.MODE === 'development';

// Contador global de requests en curso
let pendingRequests = 0;

// Interceptor para añadir token de autenticación y llevar la cuenta de requests
api.interceptors.request.use(
  (config) => {
    pendingRequests++;
    
    // Log para debugear en desarrollo
    if (isDevMode) {
      console.log(`📤 [API] Iniciando request: ${config.method.toUpperCase()} ${config.url}`);
    }
    
    // Añadir token de autenticación si existe
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    pendingRequests--;
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores y llevar la cuenta de requests completados
api.interceptors.response.use(
  (response) => {
    pendingRequests--;
    
    // Log para debugear en desarrollo
    if (isDevMode) {
      console.log(`📥 [API] Respuesta recibida: ${response.status} ${response.config.method.toUpperCase()} ${response.config.url}`);
    }
    
    return response;
  },
  (error) => {
    pendingRequests--;
    
    // Log para debugear en desarrollo
    if (isDevMode) {
      if (error.response) {
        console.error(`❌ [API] Error ${error.response.status}: ${error.config?.method?.toUpperCase() || 'REQUEST'} ${error.config?.url}`);
      } else if (error.request) {
        console.error(`❌ [API] Sin respuesta: ${error.config?.method?.toUpperCase() || 'REQUEST'} ${error.config?.url}`);
      } else {
        console.error(`❌ [API] Error de configuración:`, error.message);
      }
    }
    
    // Si hay error 401 (no autorizado), eliminar token y redirigir a login
    if (error.response && error.response.status === 401) {
      removeToken();
      
      // Solo mostrar el toast si no estamos en la página de login
      if (!window.location.pathname.includes('/login')) {
        toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Exponer el contador de requests pendientes
export const getActiveRequests = () => pendingRequests;

// Exponer un método para comprobar si el backend está activo
export const pingServer = async () => {
  try {
    const response = await axios.get(`${API_URL}`, { timeout: 5000 });
    return response.status === 200;
  } catch (error) {
    return false;
  }
};

export default api;
