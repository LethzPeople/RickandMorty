import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useProfile } from '../context/ProfileContext';
import ProfileForm from '../components/ProfileForm';
import Loader from '../components/Loader';

const ProfileEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { profiles, updateProfile, loading } = useProfile();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Buscar el perfil en la lista de perfiles
    const foundProfile = profiles.find(p => p._id === id);
    
    if (foundProfile) {
      setProfile(foundProfile);
    } else {
      toast.error('Perfil no encontrado');
      navigate('/profiles');
    }
  }, [id, profiles, navigate]);

  const handleUpdate = async (formData) => {
    try {
      await updateProfile(id, formData);
      return true;
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      return false;
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">Editar perfil</h1>
      {profile ? (
        <ProfileForm 
          onSubmit={handleUpdate} 
          initialData={profile} 
          isEdit={true} 
        />
      ) : (
        <p className="text-white">Cargando perfil...</p>
      )}
    </div>
  );
};

export default ProfileEdit;