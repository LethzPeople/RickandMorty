import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import logo from '../assets/logo.png';

const ProfileSelector = () => {
  const { user, logout } = useAuth();
  const { profiles, loading, setActiveProfile } = useProfile();
  const navigate = useNavigate();

  // Redireccionar si no hay usuario autenticado
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Manejar la selección de perfil
  const handleSelectProfile = (profile) => {
    setActiveProfile(profile);
    navigate('/');
  };

  // Función para obtener color según tipo de perfil
  const getProfileBorderColor = (type) => {
    return type === 'child' ? 'border-blue-400' : 'border-green-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-black/90">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-black/90 py-12 px-4">
      <img className="h-24 mb-8" src={logo} alt="Rick and Morty" />
      
      <h1 className="text-3xl font-bold text-cyan-400 mb-8">¿Quién está viendo?</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-5xl">
        {profiles.map((profile) => (
          <div 
            key={profile._id}
            onClick={() => handleSelectProfile(profile)}
            className={`flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-110`}
          >
            <div className={`w-28 h-28 rounded-md overflow-hidden border-4 ${getProfileBorderColor(profile.type)} mb-3`}>
              <img 
                src={profile.avatar || 'https://rickandmortyapi.com/api/character/avatar/1.jpeg'} 
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg text-white font-medium text-center">{profile.name}</h3>
            <span className="text-xs text-gray-400">
              {profile.type === 'child' ? 'Perfil infantil' : 'Perfil adulto'}
            </span>
          </div>
        ))}
        
        {/* Botón para agregar perfil */}
        {profiles.length < 5 && (
          <Link
            to="/profiles/create"
            className="flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-110"
          >
            <div className="w-28 h-28 rounded-md bg-gray-800 border-4 border-dashed border-gray-600 flex items-center justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg text-white font-medium">Añadir perfil</h3>
          </Link>
        )}
      </div>
      
      {/* Botón para gestionar perfiles */}
      <div className="mt-12 flex space-x-4">
        <button
          onClick={() => navigate('/profiles/manage')}
          className="px-6 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800"
        >
          Administrar perfiles
        </button>
        
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="px-6 py-2 border border-red-600 text-red-400 rounded-md hover:bg-red-900/30"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default ProfileSelector;