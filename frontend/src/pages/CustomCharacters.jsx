import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CharacterCard from '../components/CharacterCard';
import { useCharacters } from '../context/CharacterContext';
import Loader from '../components/Loader';

const CustomCharacters = () => {
  const { getCustomCharacters, loading } = useCharacters();
  const [customCharacters, setCustomCharacters] = useState([]);
  const [showAllUsers, setShowAllUsers] = useState(false); // New state for checkbox
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Pass showAllUsers parameter to control whether to show all characters or just the user's
        const characters = await getCustomCharacters(showAllUsers);
        setCustomCharacters(characters || []);
      } catch (err) {
        console.error('Error loading custom characters:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacters();
  }, [getCustomCharacters, showAllUsers]); 

  if (isLoading || loading) {
    return <Loader message="Cargando personajes personalizados..." />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-cyan-400 pixel-font">Mis personajes creados</h1>
        <Link 
          to="/characters/create" 
          className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors pixel-font text-sm sm:text-base"
        >
          Crear nuevo
        </Link>
      </div>
      
      {/* New checkbox control to toggle viewing mode */}
      <div className="mb-4 p-4 bg-black rounded-lg border border-green-500">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="show-all-users"
            checked={showAllUsers}
            onChange={(e) => setShowAllUsers(e.target.checked)}
            className="mr-2 h-4 w-4"
          />
          <label htmlFor="show-all-users" className="text-white">
            Incluir personajes de otros usuarios
          </label>
        </div>
        <p className="text-gray-400 text-sm mt-1 ml-6">
          {showAllUsers 
            ? "Mostrando personajes de todos los usuarios" 
            : "Mostrando solo tus personajes creados"}
        </p>
      </div>
      
      {error && (
        <div className="bg-red-900/30 text-red-200 p-4 rounded-md mb-6">
          Error al cargar personajes: {error.message || String(error) || "Error desconocido"}
        </div>
      )}
      
      {!error && customCharacters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {customCharacters.map(character => (
            <CharacterCard
              key={character._id || character.id}
              character={character}
              showControls={true}
            />
          ))}
        </div>
      ) : !error && (
        <div className="text-center py-12 bg-black rounded-lg">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">
            {showAllUsers 
              ? "No hay personajes personalizados" 
              : "No has creado personajes"}
          </h2>
          <p className="text-white max-w-lg mx-auto mb-6">
            {showAllUsers 
              ? "No se encontraron personajes personalizados creados por ningún usuario." 
              : "Crea tu primer personaje personalizado del universo de Rick and Morty."}
          </p>
          <Link 
            to="/characters/create" 
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Crear mi personaje
          </Link>
        </div>
      )}

      {/* Estilo adicional para fuente pixel */}
      <style jsx="true">{`
        .pixel-font {
          font-family: 'Press Start 2P', cursive;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};

export default CustomCharacters;