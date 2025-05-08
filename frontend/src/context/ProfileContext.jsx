import React, { createContext, useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import * as profileService from '../services/profile.service';
import { useAuth } from './AuthContext';
import { setActiveProfile, getActiveProfile, removeActiveProfile } from '../utils/token-helpers';

// Crear el contexto
export const ProfileContext = createContext();

// Hook personalizado para usar el contexto
export const useProfile = () => useContext(ProfileContext);

// Proveedor del contexto
export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const [activeProfile, setActiveProfileState] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user, initialized } = useAuth();

  // Cargar perfiles al iniciar o cuando cambia el usuario
  useEffect(() => {
    if (initialized && user) {
      loadProfiles();
    } else if (!user) {
      setProfiles([]);
      setActiveProfileState(null);
      removeActiveProfile();
    }
  }, [user, initialized]);

  // Recuperar perfil activo del localStorage
  useEffect(() => {
    const storedProfile = getActiveProfile();
    if (storedProfile && profiles.length > 0) {
      // Verificar que el perfil almacenado existe en la lista actual
      const profileExists = profiles.some(p => p._id === storedProfile._id);
      if (profileExists) {
        setActiveProfileState(storedProfile);
      } else {
        removeActiveProfile();
      }
    }
  }, [profiles]);

  // Cargar perfiles
  const loadProfiles = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await profileService.getProfiles();
      setProfiles(data);
      
      // Si no hay perfil activo y hay perfiles disponibles, activar el primero
      const storedProfile = getActiveProfile();
      if (!storedProfile && data.length > 0) {
        setActiveProfile(data[0]);
      }
      
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Error al cargar perfiles');
      console.error(error);
    }
  };

  // Establecer perfil activo
  const setActiveProfile = (profile) => {
    setActiveProfileState(profile);
    localStorage.setItem('rick_morty_active_profile', JSON.stringify(profile));
    toast.info(`Perfil activo: ${profile.name}`);
  };

  // Crear perfil
  const createProfile = async (profileData) => {
    setLoading(true);
    try {
      const newProfile = await profileService.createProfile(profileData);
      setProfiles([...profiles, newProfile]);
      setLoading(false);
      toast.success(`Perfil "${newProfile.name}" creado correctamente`);
      return newProfile;
    } catch (error) {
      setLoading(false);
      toast.error(error);
      throw error;
    }
  };

  // Actualizar perfil
  const updateProfile = async (id, profileData) => {
    setLoading(true);
    try {
      const updatedProfile = await profileService.updateProfile(id, profileData);
      
      // Actualizar la lista de perfiles
      setProfiles(profiles.map(p => p._id === id ? updatedProfile : p));
      
      // Si el perfil actualizado es el activo, actualizar también el estado del perfil activo
      if (activeProfile && activeProfile._id === id) {
        setActiveProfileState(updatedProfile);
        setActiveProfile(updatedProfile);
      }
      
      setLoading(false);
      toast.success(`Perfil "${updatedProfile.name}" actualizado correctamente`);
      return updatedProfile;
    } catch (error) {
      setLoading(false);
      toast.error(error);
      throw error;
    }
  };

  // Eliminar perfil
  const deleteProfile = async (id) => {
    setLoading(true);
    try {
      await profileService.deleteProfile(id);
      
      // Actualizar la lista de perfiles
      const updatedProfiles = profiles.filter(p => p._id !== id);
      setProfiles(updatedProfiles);
      
      // Si el perfil eliminado es el activo, cambiar al primer perfil disponible
      if (activeProfile && activeProfile._id === id) {
        if (updatedProfiles.length > 0) {
          setActiveProfileState(updatedProfiles[0]);
          setActiveProfile(updatedProfiles[0]);
        } else {
          setActiveProfileState(null);
          removeActiveProfile();
        }
      }
      
      setLoading(false);
      toast.success('Perfil eliminado correctamente');
      return true;
    } catch (error) {
      setLoading(false);
      toast.error(error);
      throw error;
    }
  };

  // Exportar valores del contexto
  const value = {
    profiles,
    activeProfile,
    loading,
    setActiveProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    loadProfiles,
  };

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
};