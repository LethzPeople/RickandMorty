import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import * as characterService from '../services/character.service';
import * as profileService from '../services/profile.service';
import { useProfile } from './ProfileContext';

// Crear el contexto
export const CharacterContext = createContext();

// Hook personalizado para usar el contexto
export const useCharacters = () => useContext(CharacterContext);

// Proveedor del contexto
export const CharacterProvider = ({ children }) => {
  const [characters, setCharacters] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { activeProfile } = useProfile();
  
  // Sistema de caché para los favoritos
  const favoritesCache = React.useRef({
    data: [],
    timestamp: 0,
    profileId: null
  });
  const CACHE_DURATION = 30000; // 30 segundos de validez para la caché

  // Cargar favoritos cuando cambia el perfil activo
  useEffect(() => {
    if (activeProfile) {
      loadFavorites();
    } else {
      setFavorites([]);
      favoritesCache.current = { data: [], timestamp: 0, profileId: null };
    }
  }, [activeProfile]);

  // Función para cargar favoritos (memorizada)
  const loadFavorites = useCallback(async () => {
    if (!activeProfile) return [];
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await profileService.getProfileFavorites(activeProfile._id);
      const favArray = Array.isArray(result) ? result : [];
      
      // Actualizar el estado y la caché
      setFavorites(favArray);
      favoritesCache.current = {
        data: favArray,
        timestamp: Date.now(),
        profileId: activeProfile._id
      };
      
      return favArray;
    } catch (error) {
      console.error("Error al cargar favoritos:", error);
      setError(error.message || "Error al cargar favoritos");
      return [];
    } finally {
      setLoading(false);
    }
  }, [activeProfile]);

  // Función para verificar si un personaje está en favoritos
  const isFavorite = useCallback((characterId) => {
    return favorites.some(fav => 
      fav._id === characterId || 
      (characterId.startsWith('api-') && fav._id === characterId)
    );
  }, [favorites]);

  // Nueva función optimizada de getFavorites que usa la caché
  const getFavorites = useCallback(async () => {
    if (!activeProfile) {
      return [];
    }
    
    // Verificar si podemos usar la caché
    const now = Date.now();
    if (
      favoritesCache.current.profileId === activeProfile._id &&
      favoritesCache.current.data.length > 0 &&
      now - favoritesCache.current.timestamp < CACHE_DURATION
    ) {
      return favoritesCache.current.data;
    }
    
    // Si no hay caché válida, cargar nuevamente
    return await loadFavorites();
  }, [activeProfile, loadFavorites]);

  // Funciones CRUD y de búsqueda (memorizada)
  const searchCharacters = useCallback(async (searchTerm, showAll = false) => {
    setLoading(true);
    setError(null);
    try {
      const profileId = activeProfile ? activeProfile._id : null;
      const results = await characterService.searchCharacters(searchTerm, profileId, showAll);
      setCharacters(results);
      toast.success(`Se encontraron ${results.length} personajes`);
      return results;
    } catch (error) {
      setError(error);
      toast.error(error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [activeProfile]);

  const getRandomCharacters = useCallback(async (count = 5) => {
    setLoading(true);
    setError(null);
    try {
      const profileId = activeProfile ? activeProfile._id : null;
      const profileType = activeProfile ? activeProfile.type : null;
      
      console.log(`Solicitando ${count} personajes aleatorios para perfil ${profileId} (tipo: ${profileType})`);
      
      // Asegurar que count sea un número válido
      const safeCount = Math.min(Math.max(1, parseInt(count) || 5), 20);
      
      const results = await characterService.getRandomCharacters(safeCount, profileId);
      
      // Verificar si los resultados tienen el formato esperado
      if (!results) {
        throw new Error('No se recibieron datos del servidor');
      }
      
      // Asegurar que results sea un array (la API podría devolver un objeto si solo hay un resultado)
      const charactersArray = Array.isArray(results) ? results : [results];
      
      // Normalizar los datos para asegurar que todos los personajes tengan _id
      const normalizedCharacters = charactersArray.map(char => {
        // Si ya tiene _id, no hay problema
        if (char._id) return char;
        
        // Si tiene apiId pero no _id, crear un _id en formato "api-X"
        if (char.apiId) {
          return { ...char, _id: `api-${char.apiId}` };
        }
        
        // Si tiene id pero no _id, usar id como _id
        if (char.id) {
          return { ...char, _id: char.id };
        }
        
        // En el peor caso, generar un id único
        return { ...char, _id: `random-${Math.random().toString(36).substr(2, 9)}` };
      });
      
      // Guardar los personajes en el estado
      setCharacters(normalizedCharacters);
      
      // Éxito
      if (normalizedCharacters.length > 0) {
        toast.success(`Se cargaron ${normalizedCharacters.length} personajes aleatorios`);
      } else {
        toast.info('No se encontraron personajes aleatorios');
      }
      
      return normalizedCharacters;
    } catch (error) {
      console.error('Error en getRandomCharacters:', error);
      setError(error);
      
      // Manejo específico según el tipo de error
      if (error.code === 'ECONNABORTED') {
        toast.error('Tiempo de espera agotado. El servidor podría estar sobrecargado.');
      } else if (!error.response) {
        toast.error('Error de conexión. Comprueba tu conexión a internet.');
      } else {
        toast.error(error.message || 'Error al obtener personajes aleatorios');
      }
      
      return [];
    } finally {
      setLoading(false);
    }
  }, [activeProfile]);

  const getCharacterById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const profileId = activeProfile ? activeProfile._id : null;
      const character = await characterService.getCharacterById(id, profileId);
      return character;
    } catch (error) {
      setError(error);
      toast.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, [activeProfile]);

  const createCharacter = useCallback(async (characterData) => {
    setLoading(true);
    setError(null);
    try {
      const newCharacter = await characterService.createCharacter(characterData);
      toast.success(`Personaje "${newCharacter.name}" creado con éxito`);
      return newCharacter;
    } catch (error) {
      setError(error);
      toast.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCharacter = useCallback(async (id, characterData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedCharacter = await characterService.updateCharacter(id, characterData);
      toast.success(`Personaje "${updatedCharacter.name}" actualizado con éxito`);
      return updatedCharacter;
    } catch (error) {
      setError(error);
      toast.error(error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCharacter = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await characterService.deleteCharacter(id);
      toast.info('Personaje eliminado con éxito');
      return true;
    } catch (error) {
      setError(error);
      toast.error(error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getCustomCharacters = useCallback(async (showAll = false) => {
    setLoading(true);
    setError(null);
    try {
      const profileId = activeProfile ? activeProfile._id : null;
      const profileType = activeProfile ? activeProfile.type : null;
      

      const params = { 
        source: 'custom',
        profileId,
        profileType,
        showAll: String(showAll) 
      };
      
      console.log(`Requesting custom characters with showAll=${params.showAll}`);
      
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        try {
          const response = await characterService.getCharacters(params);
          console.log('Characters received:', response);
          setLoading(false);
          return response.characters || [];
        } catch (innerError) {
          console.error(`Error attempt ${retryCount + 1}/${maxRetries + 1}:`, innerError);
          if (retryCount === maxRetries) throw innerError;
          retryCount++;
          await new Promise(r => setTimeout(r, 1000 * Math.pow(2, retryCount)));
        }
      }
    } catch (error) {
      console.error("Error getting custom characters:", error);
      setError(error.message || error.toString() || "Error loading characters");
      toast.error(typeof error === 'string' ? error : 'Error getting custom characters');
      return [];
    } finally {
      setLoading(false);
    }
  }, [activeProfile]);

  const addToFavorites = useCallback(async (character) => {
    if (!activeProfile) {
      toast.warning('Debes seleccionar un perfil para añadir a favoritos');
      return false;
    }
  
    if (activeProfile.type === 'child' && character.ageRestriction === 'adult') {
      toast.error('Este personaje no está disponible para perfiles infantiles');
      return false;
    }
    
    setLoading(true);
    try {
      const characterId = character._id || (character.apiId ? `api-${character.apiId}` : null);
      
      if (!characterId) {
        toast.error("ID de personaje inválido");
        return false;
      }
      
      await profileService.addFavorite(activeProfile._id, characterId);
      await loadFavorites();
      
      toast.success(`"${character.name}" añadido a favoritos`);
      return true;
    } catch (error) {
      console.error("Error al añadir a favoritos:", error);
      const errorMessage = error.response?.data?.message || error.message || "Error al añadir a favoritos";
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [activeProfile, loadFavorites]);

  const removeFromFavorites = useCallback(async (characterId) => {
    if (!activeProfile) {
      toast.warning('Debes seleccionar un perfil para gestionar favoritos');
      return false;
    }
  
    setLoading(true);
    try {
      await profileService.removeFavorite(activeProfile._id, characterId);
      
      // Actualizar la caché y el estado de favoritos
      await loadFavorites();
      
      toast.info("Personaje eliminado de favoritos");
      return true;
    } catch (error) {
      console.error("Error al eliminar de favoritos:", error);
      const errorMessage = error.response?.data?.message || error.message || "Error al eliminar de favoritos";
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, [activeProfile, loadFavorites]);

  // Exportar valores del contexto
  const value = {
    characters,
    setCharacters,
    loading,
    error,
    searchCharacters,
    getRandomCharacters,
    getCharacterById,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    getCustomCharacters,
    addToFavorites,
    removeFromFavorites,
    getFavorites,
    favorites,
    isFavorite,
    loadFavorites
  };

  return <CharacterContext.Provider value={value}>{children}</CharacterContext.Provider>;
};