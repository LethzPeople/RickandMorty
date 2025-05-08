import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useProfile } from '../context/ProfileContext';
import Swal from 'sweetalert2';
import Loader from '../components/Loader';

const ProfileManage = () => {
  const { profiles, deleteProfile, loading } = useProfile();
  const navigate = useNavigate();

  const handleDelete = (profile) => {
    // Verificar que no sea el último perfil
    if (profiles.length <= 1) {
      toast.warning('No puedes eliminar el último perfil');
      return;
    }

    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Realmente deseas eliminar el perfil "${profile.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#16a34a',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteProfile(profile._id);
        } catch (error) {
          console.error('Error al eliminar perfil:', error);
        }
      }
    });
  };

  // Función para obtener color según tipo de perfil
  const getProfileTypeStyle = (type) => {
    return type === 'child' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-green-100 text-green-800';
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-cyan-400">Administrar perfiles</h1>
        <button
          onClick={() => navigate('/profiles')}
          className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
        >
          Volver
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {profiles.map((profile) => (
          <div key={profile._id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src={profile.avatar} 
                alt={profile.name}
                className="w-16 h-16 rounded-md object-cover mr-4"
              />
              
              <div>
                <h3 className="text-xl font-bold text-white">{profile.name}</h3>
                <div className="flex space-x-2 mt-1">
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${getProfileTypeStyle(profile.type)}`}>
                    {profile.type === 'child' ? 'Infantil' : 'Adulto'}
                  </span>
                  <span className="text-gray-400 text-sm">
                    Edad: {profile.age}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Link
                to={`/profiles/${profile._id}/edit`}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Editar
              </Link>
              <button
                onClick={() => handleDelete(profile)}
                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                disabled={profiles.length <= 1}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {profiles.length < 5 && (
        <div className="mt-8 text-center">
          <Link
            to="/profiles/create"
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 inline-block"
          >
            Crear nuevo perfil
          </Link>
          <p className="text-gray-400 mt-2 text-sm">
            Puedes crear hasta 5 perfiles por cuenta
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileManage;