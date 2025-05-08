import React from 'react';
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import Layout from '../components/Layout';

// Auth Pages
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

// Profile Pages
import ProfileSelector from '../pages/ProfileSelector';
import ProfileCreate from '../pages/ProfileCreate';
import ProfileEdit from '../pages/ProfileEdit';
import ProfileManage from '../pages/ProfileManage';

// Content Pages
import HomePage from '../pages/HomePage';
import CharacterList from '../pages/CharacterList';
import CharacterDetail from '../pages/CharacterDetail';
import CharacterCreate from '../pages/CharacterCreate';
import CharacterEdit from '../pages/CharacterEdit';
import FavoritesPage from '../pages/FavoritesPage';
import CustomCharacters from '../pages/CustomCharacters';
import NotFound from '../pages/NotFound';

// Contexts
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ProfileProvider, useProfile } from '../context/ProfileContext';
import { CharacterProvider } from '../context/CharacterContext';

// Ruta protegida con autenticación
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }
  
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" />;
};

// Ruta protegida con perfil seleccionado
const ProfileProtectedRoute = () => {
  const { activeProfile } = useProfile();
  
  if (!activeProfile) {
    return <Navigate to="/profiles" />;
  }
  
  return <Outlet />;
};

const AppRouter = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <ProfileProvider>
          <CharacterProvider>
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
              {/* Rutas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Rutas protegidas por autenticación */}
              <Route element={<ProtectedRoute />}>
                {/* Selector y gestión de perfiles */}
                <Route path="/profiles" element={<ProfileSelector />} />
                <Route path="/profiles/create" element={<ProfileCreate />} />
                <Route path="/profiles/:id/edit" element={<ProfileEdit />} />
                <Route path="/profiles/manage" element={<ProfileManage />} />
                
                {/* Rutas protegidas por perfil */}
                <Route element={<ProfileProtectedRoute />}>
                  <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/characters" element={<CharacterList />} />
                    <Route path="/characters/:id" element={<CharacterDetail />} />
                    <Route path="/characters/create" element={<CharacterCreate />} />
                    <Route path="/characters/:id/edit" element={<CharacterEdit />} />
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/custom" element={<CustomCharacters />} />
                    <Route path="/404" element={<NotFound />} />
                  </Route>
                </Route>
              </Route>
              
              {/* Ruta de redirección y fallback */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </CharacterProvider>
        </ProfileProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default AppRouter;