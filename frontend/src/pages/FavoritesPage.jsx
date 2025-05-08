import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import CharacterCard from '../components/CharacterCard';
import Loader from '../components/Loader';
import { useCharacters } from '../context/CharacterContext';
import { useProfile } from '../context/ProfileContext';

const FavoritesPage = () => {
  // Usar directamente los favoritos del contexto en lugar de un estado local
  const { favorites, loading, loadFavorites } = useCharacters();
  const { activeProfile } = useProfile();
  const [error, setError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Variable para controlar si el componente está montado
    let isMounted = true;
    
    const fetchFavorites = async () => {
      // No hacer nada si no hay perfil activo
      if (!activeProfile) {
        return;
      }

      // Evitar peticiones mientras estamos retentando
      if (isRetrying) return;

      setError(null);
      
      try {
        // Cargar favoritos del contexto
        if (isMounted) {
          await loadFavorites();
        }
      } catch (error) {
        console.error('Error al cargar favoritos:', error);
        if (isMounted) {
          setError(error.message || 'Error al cargar favoritos');
        }
      }
    };

    fetchFavorites();

    // Función de limpieza para evitar actualizar el estado en componentes desmontados
    return () => {
      isMounted = false;
    };
  }, [activeProfile, loadFavorites]); 

  // Función para reintentar cargar los favoritos manualmente
  const handleRetry = async () => {
    if (!activeProfile) return;
    
    setIsRetrying(true);
    setError(null);
    
    try {
      await loadFavorites();
      toast.success('Favoritos cargados correctamente');
    } catch (error) {
      setError(error.message || 'Error al cargar favoritos');
      toast.error('Error al cargar favoritos. Por favor, intenta más tarde.');
    } finally {
      setIsRetrying(false);
    }
  };

  if (!activeProfile) {
    return (
      <div className="text-center py-12 bg-black rounded-lg">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">Perfil no seleccionado</h2>
        <p className="text-white max-w-lg mx-auto mb-6">
          Debes seleccionar un perfil para ver los favoritos.
        </p>
        <Link 
          to="/profiles" 
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          Seleccionar perfil
        </Link>
      </div>
    );
  }

  if (loading) {
    return <Loader message="Cargando favoritos..." />;
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-black rounded-lg">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
        <p className="text-white max-w-lg mx-auto mb-6">
          {error}
        </p>
        <button 
          onClick={handleRetry}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors mr-4"
          disabled={isRetrying}
        >
          {isRetrying ? 'Reintentando...' : 'Reintentar'}
        </button>
        <Link 
          to="/" 
          className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-cyan-400">Favoritos de {activeProfile?.name}</h1>
        
        {activeProfile?.type === 'child' && (
          <div className="bg-blue-900/40 text-blue-300 text-sm px-4 py-2 rounded-md border border-blue-700">
            Perfil infantil: Solo muestra contenido apto para todas las edades
          </div>
        )}
      </div>
      
      {favorites && favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map(character => (
            <CharacterCard
              key={character._id}
              character={character}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-black rounded-lg">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">No tienes favoritos</h2>
          <p className="text-white max-w-lg mx-auto mb-6">
            Explora los personajes y añade algunos a tus favoritos para verlos aquí.
          </p>
          <Link 
            to="/characters" 
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Explorar personajes
          </Link>
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;