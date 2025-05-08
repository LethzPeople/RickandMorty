import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <h1 className="text-5xl font-bold text-cyan-400 mb-6">404</h1>
      <h2 className="text-3xl font-bold text-white mb-4">Página no encontrada</h2>
      <p className="text-gray-300 mb-8 max-w-lg">
        ¡Oh no! Parece que te has perdido en alguna dimensión desconocida. 
        Esta página no existe en nuestro universo.
      </p>
      <img
        src="https://rickandmortyapi.com/api/character/avatar/3.jpeg"
        alt="Rick and Morty"
        className="w-32 h-32 rounded-full mb-8"
      />
      <Link
        to="/"
        className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors"
      >
        Volver al inicio
      </Link>
    </div>
  );
};

export default NotFound;
