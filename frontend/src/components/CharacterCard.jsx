import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCharacters } from '../context/CharacterContext';
import { useProfile } from '../context/ProfileContext';
import { truncateText } from '../utils/responsive-utils';
import Swal from 'sweetalert2';

const CharacterCard = ({ character, showControls = false }) => {
  const [showDetails, setShowDetails] = useState(false);
  const { addToFavorites, removeFromFavorites, deleteCharacter, isFavorite, loadFavorites } = useCharacters();
  const { activeProfile } = useProfile();
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

  // Asegurar que el personaje tenga las propiedades necesarias
  if (!character || typeof character !== 'object') {
    console.error('CharacterCard: Se recibió un personaje inválido', character);
    return null;
  }

  // Normalizar las propiedades del personaje para evitar errores
  const normalizedCharacter = {
    _id: character._id || character.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
    name: character.name || 'Personaje sin nombre',
    status: character.status || 'unknown',
    species: character.species || 'unknown',
    gender: character.gender || 'unknown',
    type: character.type || '',
    origin: character.origin || { name: 'unknown' },
    location: character.location || { name: 'unknown' },
    image: character.image || '/no-image.png',
    created: character.created || new Date().toISOString(),
    ageRestriction: character.ageRestriction || 'all',
    isCustom: character.isCustom || false,
    apiId: character.apiId || null,
    creator: character.creator || null
  };

  // Determinar si es un personaje personalizado
  const isCustom = normalizedCharacter.isCustom;
  const characterId = normalizedCharacter._id;
  
  // Verificar si el personaje pertenece al usuario actual
  const isUsersCharacter = isCustom && (!normalizedCharacter.creator || 
    (activeProfile && normalizedCharacter.creator._id === activeProfile.user));

  // Verificar si el personaje está en favoritos
  useEffect(() => {
    if (activeProfile && characterId) {
      try {
        setIsFav(isFavorite(characterId));
      } catch (error) {
        console.error('Error verificando favorito:', error);
        setIsFav(false);
      }
    } else {
      setIsFav(false);
    }
  }, [activeProfile, characterId, isFavorite]);

  const handleFavoriteToggle = async () => {
    if (!activeProfile) {
      Swal.fire({
        title: 'Error',
        text: 'Debes seleccionar un perfil para usar favoritos',
        icon: 'error',
        confirmButtonColor: '#16a34a'
      });
      return;
    }

    if (activeProfile.type === 'child' && normalizedCharacter.ageRestriction === 'adult') {
      Swal.fire({
        title: 'Contenido restringido',
        text: 'Este personaje no está disponible para perfiles infantiles',
        icon: 'warning',
        confirmButtonColor: '#16a34a'
      });
      return;
    }

    setLoading(true);
    try {
      if (isFav) {
        await removeFromFavorites(characterId);
        setIsFav(false);
        await loadFavorites();
      } else {
        const success = await addToFavorites(normalizedCharacter);
        if (success) {
          setIsFav(true);
        }
      }
    } catch (error) {
      console.error('Error al gestionar favorito:', error);
      const errorMessage = error.response?.data?.message || 'Error al gestionar favoritos';
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#16a34a'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Realmente deseas eliminar a "${normalizedCharacter.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCharacter(characterId);
        } catch (error) {
          console.error('Error al eliminar personaje:', error);
          Swal.fire({
            title: 'Error',
            text: typeof error === 'string' ? error : 'Error al eliminar el personaje',
            icon: 'error',
            confirmButtonColor: '#16a34a'
          });
        }
      }
    });
  };

  return (
    <div className="bg-black rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg max-w-full">
      <img
        src={normalizedCharacter.image}
        alt={normalizedCharacter.name}
        className="w-full h-64 object-cover"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = '/no-image.png';
        }}
      />

      <div className="p-4">
        <h3 className="text-xl font-bold text-cyan-400 mb-2 text-ellipsis overflow-hidden">{truncateText(normalizedCharacter.name, 25)}</h3>

        {/* Mostrar información del creador si no es el del usuario actual y es personalizado */}
        {isCustom && normalizedCharacter.creator && !isUsersCharacter && (
          <div className="text-xs text-gray-400 mb-2">
            Creado por: {typeof normalizedCharacter.creator === 'object' ? normalizedCharacter.creator.name : 'Usuario'}
          </div>
        )}

        <div className="flex items-center mb-3">
          <span
            className={`inline-block w-3 h-3 rounded-full mr-2 ${normalizedCharacter.status === 'Alive' ? 'bg-green-500' :
              normalizedCharacter.status === 'Dead' ? 'bg-red-500' : 'bg-gray-500'
              }`}
          ></span>
          <span className="text-white text-ellipsis overflow-hidden">
            {normalizedCharacter.status} - {normalizedCharacter.species}
          </span>
        </div>

        {normalizedCharacter.ageRestriction === 'adult' && (
          <div className="bg-red-900/30 text-red-400 text-xs px-2 py-1 rounded-sm mb-3 inline-block">
            Solo para perfiles adultos
          </div>
        )}

        {/* Botones Ver detalle y Ver resumen en formato pixel art */}
        <div className="flex flex-wrap gap-2 mb-3 pixel-font">
          <Link
            to={`/characters/${characterId}`}
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            Ver detalle
          </Link>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-green-600 hover:text-green-800 text-sm font-medium"
          >
            Ver resumen
          </button>
        </div>

        {showDetails && (
          <div className="mt-2 text-sm text-white space-y-1 bg-black border border-green-400 p-2 rounded">
            <p><span className="font-medium">Género:</span> {normalizedCharacter.gender}</p>
            <p className="truncate"><span className="font-medium">Origen:</span> {normalizedCharacter.origin?.name || 'Desconocido'}</p>
            <p className="truncate"><span className="font-medium">Ubicación:</span> {normalizedCharacter.location?.name || 'Desconocido'}</p>
            <p><span className="font-medium">Creado:</span> {new Date(normalizedCharacter.created).toLocaleDateString()}</p>
          </div>
        )}

        <div className="mt-4 flex flex-wrap justify-between gap-2">
          {isCustom && showControls && isUsersCharacter && (
            <div className="flex flex-wrap gap-2">
              <Link
                to={`/characters/${characterId}/edit`}
                className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600"
              >
                Editar
              </Link>
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          )}

          <button
            onClick={handleFavoriteToggle}
            disabled={loading || (activeProfile?.type === 'child' && normalizedCharacter.ageRestriction === 'adult')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors w-full sm:w-auto ${loading ? 'opacity-50 cursor-not-allowed' :
                activeProfile?.type === 'child' && normalizedCharacter.ageRestriction === 'adult' ?
                  'bg-gray-400 text-gray-700 cursor-not-allowed' :
                  isFav
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-black hover:bg-green-500'
              }`}
          >
            {activeProfile?.type === 'child' && normalizedCharacter.ageRestriction === 'adult' ?
              '🔒 Solo para adultos' :
              (isFav ? '❤️ Quitar de favoritos' : '🤍 Agregar a favoritos')}
          </button>
        </div>
      </div>

      {/* Estilo adicional para fuente pixel */}
      <style jsx="true">{`
        .pixel-font {
          font-family: 'Press Start 2P', cursive;
          font-size: 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default CharacterCard;