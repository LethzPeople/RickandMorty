import api from './api.js';
import { setToken, removeToken } from '../utils/token-helpers.js';

// Login de usuario
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al iniciar sesión';
  }
};

// Registro de usuario
export const register = async (name, email, password) => {
  try {
    const response = await api.post('/auth/register', { name, email, password });
    if (response.data.token) {
      setToken(response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al registrar usuario';
  }
};

// Cerrar sesión
export const logout = () => {
  removeToken();
};

// Obtener perfil de usuario
export const getUserProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al obtener perfil';
  }
};

// Actualizar perfil de usuario
export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || 'Error al actualizar perfil';
  }
};