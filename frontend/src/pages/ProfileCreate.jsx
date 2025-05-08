import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../context/ProfileContext';
import ProfileForm from '../components/ProfileForm';

const ProfileCreate = () => {
  const { createProfile, profiles } = useProfile();
  const navigate = useNavigate();

  // Comprobar si ya se alcanzó el límite de perfiles
  if (profiles.length >= 5) {
    navigate('/profiles');
    return null;
  }

  const handleCreate = async (formData) => {
    try {
      await createProfile(formData);
      return true;
    } catch (error) {
      console.error('Error al crear perfil:', error);
      return false;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">Crear nuevo perfil</h1>
      <p className="text-white mb-6">
        Crea un nuevo perfil para tu cuenta. Puedes crear hasta 5 perfiles diferentes.
      </p>
      
      <ProfileForm onSubmit={handleCreate} />
    </div>
  );
};

export default ProfileCreate;