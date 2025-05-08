import React from 'react';
import { Link } from 'react-router-dom';
import CharacterCard from '../components/CharacterCard';
import SearchForm from '../components/SearchForm';
import Loader from '../components/Loader';
import { useCharacters } from '../context/CharacterContext';

const CharacterList = () => {
  const { characters, loading, error } = useCharacters();

  return (
    <div>
      <SearchForm />
      
      {loading ? (
        <Loader />
      ) : error ? (
        <div className="text-center py-8 bg-black rounded-lg">
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error</h2>
          <p className="text-white max-w-lg mx-auto mb-6">
            {typeof error === 'string' ? error : 'Error al cargar personajes. Por favor, inténtalo de nuevo.'}
          </p>
        </div>
      ) : characters.length > 0 ? (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-cyan-400">Personajes ({characters.length})</h2>
            <Link 
              to="/characters/create" 
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Crear nuevo
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {characters.map((character) => (
              <CharacterCard
                key={character._id || `char-${Math.random()}`}
                character={character}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-black rounded-lg">
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">No hay personajes</h2>
          <p className="text-white max-w-lg mx-auto mb-6">
            Busca personajes por nombre o carga algunos aleatorios para comenzar a explorar.
          </p>
          <Link 
            to="/characters/create" 
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Crear personaje
          </Link>
        </div>
      )}
    </div>
  );
};

export default CharacterList;