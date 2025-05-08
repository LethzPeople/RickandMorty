import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import * as authService from '../services/auth.service';
import { isAuthenticated, getUser, setUser, removeToken } from '../utils/token-helpers';

// Crear el contexto
export const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Inicializar estado de autenticación al cargar
  useEffect(() => {
    const initAuth = async () => {
      if (isAuthenticated()) {
        try {
          // Intentar obtener el perfil del usuario para verificar si el token es válido
          const userData = await authService.getUserProfile();
          setUserState(userData);
        } catch (error) {
          console.error('Error al verificar autenticación:', error);
          logout();
        }
      }
      setLoading(false);
      setInitialized(true);
    };

    initAuth();
  }, []);

  // Función para login
  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      setUserState(data);
      setUser(data);
      setLoading(false);
      toast.success(`Bienvenido, ${data.name}!`);
      return data;
    } catch (error) {
      setLoading(false);
      toast.error(error);
      throw error;
    }
  };

  // Función para registro
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const data = await authService.register(name, email, password);
      setUserState(data);
      setUser(data);
      setLoading(false);
      toast.success(`Cuenta creada correctamente. ¡Bienvenido, ${data.name}!`);
      return data;
    } catch (error) {
      setLoading(false);
      toast.error(error);
      throw error;
    }
  };

  // Función para logout
  const logout = () => {
    authService.logout();
    setUserState(null);
    toast.info('Sesión cerrada');
  };

  // Función para actualizar perfil
  const updateProfile = async (userData) => {
    setLoading(true);
    try {
      const updatedUser = await authService.updateUserProfile(userData);
      setUserState(updatedUser);
      setUser(updatedUser);
      setLoading(false);
      toast.success('Perfil actualizado correctamente');
      return updatedUser;
    } catch (error) {
      setLoading(false);
      toast.error(error);
      throw error;
    }
  };

  // Función para verificar si el usuario es administrador
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // Exportar valores del contexto
  const value = {
    user,
    loading,
    initialized,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: () => !!user,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};