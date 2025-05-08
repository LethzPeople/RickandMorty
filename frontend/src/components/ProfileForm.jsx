import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

const avatarOptions = [
  'https://rickandmortyapi.com/api/character/avatar/1.jpeg', // Rick
  'https://rickandmortyapi.com/api/character/avatar/2.jpeg', // Morty
  'https://rickandmortyapi.com/api/character/avatar/3.jpeg', // Summer
  'https://rickandmortyapi.com/api/character/avatar/4.jpeg', // Beth
  'https://rickandmortyapi.com/api/character/avatar/5.jpeg', // Jerry
  'https://rickandmortyapi.com/api/character/avatar/118.jpeg', // Evil Morty
  'https://rickandmortyapi.com/api/character/avatar/242.jpeg', // Mr. Poopybutthole
  'https://rickandmortyapi.com/api/character/avatar/15.jpeg', // Alien Rick
  'https://rickandmortyapi.com/api/character/avatar/20.jpeg', // Ants in my Eyes Johnson
  'https://rickandmortyapi.com/api/character/avatar/244.jpeg', // Mr. Meeseeks
];

const ProfileForm = ({ onSubmit, initialData = null, isEdit = false }) => {
  const defaultForm = {
    name: '',
    avatar: avatarOptions[0],
    type: 'adult',
    age: 18
  };

  const { 
    control, 
    handleSubmit, 
    setValue, 
    watch, 
    formState: { errors }, 
    reset
  } = useForm({
    defaultValues: initialData || defaultForm
  });

  const navigate = useNavigate();
  const typeValue = watch('type');
  const ageValue = watch('age');
  const avatarValue = watch('avatar');

  // Cargar datos iniciales cuando están disponibles
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  // Ajustar la edad automáticamente cuando cambia el tipo de perfil
  useEffect(() => {
    if (typeValue === 'child' && ageValue > 12) {
      setValue('age', 8); // Edad predeterminada para niños
    } else if (typeValue === 'adult' && ageValue < 13) {
      setValue('age', 18); // Edad predeterminada para adultos
    }
  }, [typeValue, ageValue, setValue]);

  const handleAvatarSelect = (avatarUrl) => {
    setValue('avatar', avatarUrl);
  };

  const onFormSubmit = async (data) => {
    const success = await onSubmit(data);
    if (success) {
      navigate('/profiles');
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="bg-black p-6 rounded-lg shadow-lg">
      {/* Sección de errores */}
      {Object.keys(errors).length > 0 && (
        <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <p className="font-bold">Por favor corrige los siguientes errores:</p>
          <ul className="list-disc ml-5">
            {Object.values(errors).map((error, index) => (
              <li key={index}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="name" className="block text-white font-medium mb-2">Nombre del perfil*</label>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'El nombre del perfil es obligatorio' }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              id="name"
              className={`w-full px-4 py-2 bg-black text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Nombre del perfil"
            />
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="type" className="block text-white font-medium mb-2">Tipo de perfil*</label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <select
                {...field}
                id="type"
                className="w-full px-4 py-2 bg-black text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                onChange={(e) => {
                  field.onChange(e);
                  // Actualizar edad automáticamente al cambiar tipo
                  if (e.target.value === 'child') {
                    setValue('age', 8);
                  } else {
                    setValue('age', 18);
                  }
                }}
              >
                <option value="adult">Adulto</option>
                <option value="child">Niño</option>
              </select>
            )}
          />
          <p className="mt-1 text-sm text-gray-400">
            {typeValue === 'child' ? 'Los perfiles infantiles solo ven contenido apropiado para todas las edades' : 'Los perfiles adultos acceden a todo el contenido'}
          </p>
        </div>

        <div>
          <label htmlFor="age" className="block text-white font-medium mb-2">Edad</label>
          <Controller
            name="age"
            control={control}
            rules={{ 
              required: 'La edad es obligatoria',
              min: { value: 1, message: 'La edad mínima es 1 año' },
              max: { value: 99, message: 'La edad máxima es 99 años' }
            }}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                id="age"
                min={1}
                max={99}
                className={`w-full px-4 py-2 bg-black text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.age ? 'border-red-500' : 'border-gray-300'}`}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  field.onChange(value);
                  // Actualizar tipo automáticamente según edad
                  if (value < 13) {
                    setValue('type', 'child');
                  } else {
                    setValue('type', 'adult');
                  }
                }}
              />
            )}
          />
          {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-white font-medium mb-2">Avatar</label>
        <Controller
          name="avatar"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              {avatarOptions.map((avatar, index) => (
                <div 
                  key={index}
                  onClick={() => handleAvatarSelect(avatar)}
                  className={`cursor-pointer p-1 rounded-md ${avatarValue === avatar ? 'ring-2 ring-green-500 bg-green-900/30' : 'hover:bg-gray-800'}`}
                >
                  <img 
                    src={avatar} 
                    alt={`Avatar ${index + 1}`}
                    className="w-full h-24 object-cover rounded-sm"
                  />
                </div>
              ))}
            </div>
          )}
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => navigate('/profiles')}
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          {isEdit ? 'Actualizar perfil' : 'Crear perfil'}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;