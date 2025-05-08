import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCharacters } from '../context/CharacterContext';
import Loader from '../components/Loader';
import Swal from 'sweetalert2';
import { useProfile } from '../context/ProfileContext';

const CharacterDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getCharacterById, addToFavorites, removeFromFavorites, deleteCharacter, loading, isFavorite, loadFavorites } = useCharacters();
  const { activeProfile } = useProfile();
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState(null);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  
  const isCustom = character && character.isCustom;

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const result = await getCharacterById(id);
        if (result) {
          setCharacter(result);
        } else {
          navigate('/404');
        }
      } catch (err) {
        setError('No se pudo cargar el personaje');
        navigate('/404');
      }
    };
    
    fetchCharacter();
  }, [id, getCharacterById, navigate]);

  // Verificar si el personaje está en favoritos
  useEffect(() => {
    if (character && activeProfile) {
      try {
        setIsFav(isFavorite(character._id));
      } catch (error) {
        console.error('Error verificando favorito:', error);
        setIsFav(false);
      }
    }
  }, [character, activeProfile, isFavorite]);

  const handleFavoriteToggle = async () => {
    if (!activeProfile) {
      Swal.fire({
        title: 'Error',
        text: 'Debes seleccionar un perfil para gestionar favoritos',
        icon: 'error',
        confirmButtonColor: '#16a34a'
      });
      return;
    }

    setFavLoading(true);
    try {
      if (isFav) {
        await removeFromFavorites(character._id);
        setIsFav(false);
        // Actualizar la lista de favoritos
        await loadFavorites();
      } else {
        await addToFavorites(character);
        setIsFav(true);
      }
    } catch (error) {
      console.error('Error al gestionar favorito:', error);
      const errorMessage = error.response?.data?.message || error.message || "Error al gestionar favoritos";
      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#16a34a'
      });
    } finally {
      setFavLoading(false);
    }
  };
  
  const handleDelete = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Realmente deseas eliminar a "${character.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCharacter(character._id);
          navigate('/custom');
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

  if (loading) return <Loader />;
  
  if (!character && !loading && !error) return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">Personaje no encontrado</h2>
      <Link to="/characters" className="text-green-600 hover:text-green-800">
        Volver a la lista de personajes
      </Link>
    </div>
  );

  return (
    character && (
      <div className="bg-black rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3">
            <img
              src={character.image || '/no-image.png'}
              alt={character.name}
              className="w-full h-auto object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/no-image.png';
              }}
            />
          </div>
          
          <div className="md:w-2/3 p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-cyan-400 mb-4">{character.name}</h1>
              
              <div className="flex space-x-2">
              <button
  onClick={handleFavoriteToggle}
  disabled={favLoading || (activeProfile?.type === 'child' && character.ageRestriction === 'adult')}
  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
    favLoading ? 'opacity-50 cursor-not-allowed' : 
    activeProfile?.type === 'child' && character.ageRestriction === 'adult' ?
    'bg-gray-400 text-gray-700 cursor-not-allowed' :
    isFav
      ? 'bg-red-100 text-red-700 hover:bg-red-200'
      : 'bg-green-100 text-black hover:bg-green-500'
  }`}
>
  {activeProfile?.type === 'child' && character.ageRestriction === 'adult' ?
    '🔒 Solo para adultos' :
    (isFav ? '❤️ Quitar de favoritos' : '🤍 Añadir a favoritos')}
</button>
              </div>
            </div>
            
            <div className="flex items-center mb-6">
              <span
                className={`inline-block w-4 h-4 rounded-full mr-2 ${
                  character.status === 'Alive' ? 'bg-green-500' : 
                  character.status === 'Dead' ? 'bg-red-500' : 'bg-gray-500'
                }`}
              ></span>
              <span className="text-white text-lg">
                {character.status} - {character.species}
              </span>
            </div>
            
            {/* Añadir advertencia de contenido para adultos aquí */}
            {character.ageRestriction === 'adult' && (
              <div className="bg-red-900/30 text-red-400 text-sm px-3 py-2 rounded-sm mb-6 inline-block">
                Solo para perfiles adultos
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-white mb-8">
              <div>
                <h3 className="text-sm text-gray-400">Género</h3>
                <p className="text-lg">{character.gender}</p>
              </div>
              
              {character.type && (
                <div>
                  <h3 className="text-sm text-gray-400">Tipo</h3>
                  <p className="text-lg">{character.type}</p>
                </div>
              )}
              
              <div>
                <h3 className="text-sm text-gray-400">Origen</h3>
                <p className="text-lg">{character.origin?.name || 'Desconocido'}</p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-400">Ubicación actual</h3>
                <p className="text-lg">{character.location?.name || 'Desconocido'}</p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-400">Fecha de creación</h3>
                <p className="text-lg">{new Date(character.created).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-4">
              <Link
                to="/characters"
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Volver a la lista
              </Link>
              
              {isCustom && (
                <>
                  <Link
                    to={`/characters/${character._id}/edit`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Editar
                  </Link>
                  
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                  >
                    Eliminar
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default CharacterDetail;