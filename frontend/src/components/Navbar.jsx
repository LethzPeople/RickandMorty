import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { activeProfile, profiles, setActiveProfile } = useProfile();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) => 
    isActive ? "text-green-300 transition" : "hover:text-green-200 transition";

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileChange = (profile) => {
    setActiveProfile(profile);
    setIsProfileMenuOpen(false);
  };

  return (
    <header className="bg-black dark:bg-gray-900 text-white py-4 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center z-10">
            <Link to="/">
              <img src={logo} alt="Rick and Morty Logo" className="h-10 sm:h-12" />
            </Link>
          </div>

          {/* Menú para escritorio */}
          <div className="hidden md:flex space-x-6">
            <NavLink to="/" className={navLinkClass}>Inicio</NavLink>
            <NavLink to="/characters" end className={navLinkClass}>Personajes</NavLink>
            <NavLink to="/characters/create" className={navLinkClass}>Crear Personaje</NavLink>
            <NavLink to="/custom" className={navLinkClass}>Mis Personajes</NavLink>
            <NavLink to="/favorites" className={navLinkClass}>
              Favoritos
            </NavLink>
          </div>

          {/* Perfil y logout */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Botón de tema */}
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-700">
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            
            {/* Selector de perfiles */}
            {activeProfile && (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-800"
                >
                  <img 
                    src={activeProfile.avatar} 
                    alt={activeProfile.name}
                    className="w-8 h-8 rounded-md object-cover"
                  />
                  <span className="text-sm font-medium max-w-[100px] truncate">{activeProfile.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown para perfiles */}
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg z-10">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
                        Cambiar perfil
                      </div>
                      
                      {profiles.map(profile => (
                        <button
                          key={profile._id}
                          onClick={() => handleProfileChange(profile)}
                          className={`w-full text-left block px-4 py-2 text-sm ${
                            profile._id === activeProfile._id
                              ? 'bg-green-800 text-white'
                              : 'text-gray-300 hover:bg-gray-800'
                          }`}
                        >
                          <div className="flex items-center">
                            <img 
                              src={profile.avatar} 
                              alt={profile.name}
                              className="w-6 h-6 rounded-sm object-cover mr-2"
                            />
                            <span className="truncate">{profile.name}</span>
                          </div>
                        </button>
                      ))}
                      
                      <div className="border-t border-gray-700 mt-1">
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            navigate('/profiles');
                          }}
                          className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800"
                        >
                          Administrar perfiles
                        </button>
                        
                        <button
                          onClick={handleLogout}
                          className="w-full text-left block px-4 py-2 text-sm text-red-400 hover:bg-gray-800"
                        >
                          Cerrar sesión
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Botón para menú móvil */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none z-20"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isMenuOpen && (
          <div className="mt-4 md:hidden">
            <div className="flex flex-col space-y-4 pb-3">
              {activeProfile && (
                <div className="flex items-center space-x-2 px-2 py-3 bg-gray-800 rounded-md mb-2">
                  <img 
                    src={activeProfile.avatar} 
                    alt={activeProfile.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm font-medium truncate">{activeProfile.name}</span>
                </div>
              )}
              
              <NavLink to="/" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Inicio</NavLink>
              <NavLink to="/characters" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Personajes</NavLink>
              <NavLink to="/characters/create" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Crear Personaje</NavLink>
              <NavLink to="/custom" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>Mis Personajes</NavLink>
              <NavLink to="/favorites" className={navLinkClass} onClick={() => setIsMenuOpen(false)}>
                Favoritos
              </NavLink>
              
              {/* Botón de tema para móvil */}
              <button
                onClick={() => {
                  toggleTheme();
                  setIsMenuOpen(false);
                }}
                className="text-left flex items-center space-x-2 text-gray-300 hover:text-green-300 transition py-1"
              >
                {darkMode ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>Modo claro</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                    <span>Modo oscuro</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/profiles');
                }}
                className="text-left text-gray-300 hover:text-green-300 transition py-1"
              >
                Cambiar perfil
              </button>
              
              <button
                onClick={handleLogout}
                className="text-left text-red-400 hover:text-red-300 transition py-1"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;