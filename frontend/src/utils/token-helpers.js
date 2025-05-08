// Nombre del token en localStorage
const TOKEN_KEY = 'rick_morty_auth_token';
const USER_KEY = 'rick_morty_user';
const PROFILE_KEY = 'rick_morty_active_profile';

// Guardar token en localStorage
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

// Obtener token de localStorage
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

// Eliminar token de localStorage
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(PROFILE_KEY);
};

// Verificar si hay token (usuario autenticado)
export const isAuthenticated = () => {
  return !!getToken();
};

// Guardar datos del usuario en localStorage
export const setUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Obtener datos del usuario de localStorage
export const getUser = () => {
  const userStr = localStorage.getItem(USER_KEY);
  return userStr ? JSON.parse(userStr) : null;
};

// Guardar perfil activo en localStorage
export const setActiveProfile = (profile) => {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
};

// Obtener perfil activo de localStorage
export const getActiveProfile = () => {
  const profileStr = localStorage.getItem(PROFILE_KEY);
  return profileStr ? JSON.parse(profileStr) : null;
};

// Eliminar perfil activo de localStorage
export const removeActiveProfile = () => {
  localStorage.removeItem(PROFILE_KEY);
};