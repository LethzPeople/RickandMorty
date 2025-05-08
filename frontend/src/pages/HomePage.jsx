import React from 'react';
import { Link } from 'react-router-dom';
import SearchForm from '../components/SearchForm';

const HomePage = () => {
  return (
    <div className="flex flex-col space-y-6">
      <div className="text-center py-8 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-green-400 mb-4 pixel-font">
          ¡Bienvenido a Rick and Morty Explorer!
        </h1>
        <p className="text-white text-lg max-w-2xl mx-auto mb-8 pixel-font">
          Explora el multiverso de Rick and Morty: busca personajes, crea tus propios personajes
          y guarda tus favoritos para futuras referencias.
        </p>
      </div>

      {/* Tres recuadros arriba del formulario de búsqueda */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto px-4">
        <Link 
          to="/characters"
          className="bg-black p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:transform hover:scale-105"
        >
          <h2 className="text-xl font-bold text-green-400 mb-2 pixel-font">Explorar personajes</h2>
          <p className="text-gray-300">Busca entre cientos de personajes de la serie</p>
        </Link>
        
        <Link 
          to="/characters/create"
          className="bg-black p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:transform hover:scale-105"
        >
          <h2 className="text-xl font-bold text-green-400 mb-2 pixel-font">Crear personaje</h2>
          <p className="text-gray-300">Crea tu propio personaje del universo</p>
        </Link>
        
        <Link 
          to="/favorites"
          className="bg-black p-6 rounded-lg shadow-md hover:shadow-lg transition-all hover:transform hover:scale-105"
        >
          <h2 className="text-xl font-bold text-green-400 mb-2 pixel-font">Ver favoritos</h2>
          <p className="text-gray-300">Accede rápidamente a tus personajes guardados</p>
        </Link>
      </div>

      {/* Formulario de búsqueda después de los recuadros */}
      <SearchForm />
      
      {/* Estilo adicional para fuente pixel */}
      <style jsx="true">{`
        .pixel-font {
          font-family: 'Press Start 2P', cursive;
          text-shadow: 2px 2px 0px #000000;
          line-height: 1.4;
        }
      `}</style>
    </div>
  );
};

export default HomePage;