import React, { useState } from 'react';
import { useCharacters } from '../context/CharacterContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SearchForm = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [characterCount, setCharacterCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const { searchCharacters, getRandomCharacters, setCharacters } = useCharacters();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsLoading(true);
      try {
        const results = await searchCharacters(searchTerm, showAllUsers);
        if (results && results.length > 0) {
          navigate('/characters');
        } else {
          toast.info('No se encontraron personajes con ese nombre');
        }
      } catch (error) {
        console.error('Error al buscar:', error);
        toast.error(typeof error === 'string' ? error : 'Error al buscar personajes');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCountChange = (e) => {
    const value = parseInt(e.target.value);
    setCharacterCount(value > 0 ? Math.min(value, 20) : 1); // Limitamos a 20 como máximo
  };

  const handleRandomSearch = async () => {
    setIsLoading(true);
    try {
      // Nos aseguramos de que characterCount sea un número y esté en el rango válido
      const count = Math.min(Math.max(1, characterCount), 20);
      const results = await getRandomCharacters(count);
      
      if (Array.isArray(results) && results.length > 0) {
        // Establecemos directamente los resultados en el contexto
        setCharacters(results);
        navigate('/characters');
      } else {
        toast.info('No se pudieron obtener personajes aleatorios');
      }
    } catch (error) {
      console.error('Error al obtener aleatorios:', error);
      toast.error(typeof error === 'string' ? error : 'Error al obtener personajes aleatorios');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-black p-6 rounded-lg shadow-md mb-6">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label htmlFor="search" className="block text-white font-medium mb-2">
            Buscar personajes
          </label>
          <div className="sm:flex sm:flex-row w-full">
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ingresa el nombre de un personaje..."
              className="w-full sm:flex-grow px-4 py-2 bg-black text-white border border-gray-300 rounded-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-green-400 mb-2 sm:mb-0"
              disabled={isLoading}
            />
            <button
              type="submit"
              className={`w-full sm:w-auto bg-green-600 text-black px-4 py-2 rounded-md sm:rounded-l-none hover:bg-green-700 transition-colors ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
          
          {/* Enhanced search options section */}
          <div className="mt-3 p-3 border border-green-500 rounded-md">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="show-all-users"
                checked={showAllUsers}
                onChange={(e) => setShowAllUsers(e.target.checked)}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="show-all-users" className="text-white font-medium">
                Incluir personajes de otros usuarios
              </label>
            </div>
            <p className="text-gray-400 text-sm mt-1 ml-6">
              {showAllUsers 
                ? "La búsqueda incluirá personajes creados por todos los usuarios" 
                : "La búsqueda solo incluirá tus personajes creados"}
            </p>
          </div>
        </div>
      </form>

      <div className="bg-black p-4 rounded-md border border-green-500">
        <h3 className="text-lg font-medium text-white mb-3">Obtener personajes aleatorios</h3>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="w-full sm:w-auto">
            <label htmlFor="character-count" className="block text-sm text-white mb-1">
              Cantidad de personajes
            </label>
            <input
              type="number"
              id="character-count"
              min="1"
              max="20"
              value={characterCount}
              onChange={handleCountChange}
              className="w-full sm:w-16 px-2 py-1 bg-black text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleRandomSearch}
            className={`bg-green-600 text-black px-4 py-2 rounded-md hover:bg-green-700 transition-colors sm:mt-5 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Cargando...' : 'Obtener aleatorios'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;