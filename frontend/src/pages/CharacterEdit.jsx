import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCharacters } from '../context/CharacterContext';
import CharacterForm from '../components/CharacterForm';
import Loader from '../components/Loader';
import * as characterService from '../services/character.service';

const CharacterEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { updateCharacter, loading, error: contextError } = useCharacters();
  const [character, setCharacter] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Intenta obtener el personaje directamente usando el servicio
        const result = await characterService.getCharacterById(id);
        
        if (result) {
          // Adaptar el formato del personaje para el formulario
          const formattedCharacter = {
            ...result,
            originName: result.origin?.name || '',
            locationName: result.location?.name || ''
          };
          setCharacter(formattedCharacter);
        } else {
          throw new Error('Personaje no encontrado');
        }
      } catch (err) {
        console.error('Error al cargar el personaje:', err);
        setError('No se pudo cargar el personaje. Verifica que el ID sea correcto.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  const handleUpdate = async (formData) => {
    try {
      const success = await updateCharacter(id, formData);
      if (success) {
        navigate('/custom');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al actualizar personaje:', error);
      return false;
    }
  };

  if (isLoading || loading) return <Loader message="Cargando personaje..." />;

  if (error || contextError) {
    return (
      <div className="text-center py-12 bg-black rounded-lg">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
        <p className="text-white mb-6">{error || contextError}</p>
        <button
          onClick={() => navigate('/custom')}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Volver a mis personajes
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">Editar personaje</h1>
      {character ? (
        <CharacterForm 
          onSubmit={handleUpdate} 
          initialData={character} 
          isEdit={true} 
        />
      ) : (
        <div className="text-center py-12 bg-black rounded-lg">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-white mb-6">No se pudo cargar el personaje</p>
          <button
            onClick={() => navigate('/custom')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Volver a mis personajes
          </button>
        </div>
      )}
    </div>
  );
};

export default CharacterEdit;