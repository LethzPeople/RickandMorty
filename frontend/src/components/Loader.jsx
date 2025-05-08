import React from 'react';

const Loader = ({ message = 'Cargando...' }) => {
  return (
    <div className="flex flex-col justify-center items-center py-12">
      <div className="relative w-24 h-24">
        {/* Portal giratorio de Rick and Morty */}
        <div className="absolute inset-0 rounded-full border-8 border-transparent border-t-green-400 border-b-cyan-400 animate-spin"></div>
        <div className="absolute inset-3 rounded-full border-4 border-transparent border-l-green-600 border-r-cyan-600 animate-spin-slow"></div>
        
        {/* Punto central */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 bg-white rounded-full"></div>
        </div>
      </div>
      
      <p className="mt-4 text-lg text-white animate-pulse">{message}</p>
    </div>
  );
};

export default Loader;