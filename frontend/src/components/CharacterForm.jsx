import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

const CharacterForm = ({ onSubmit, initialData = null, isEdit = false }) => {
  const defaultForm = {
    name: '',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    originName: 'Earth',
    locationName: 'Earth',
    image: 'https://rickandmortyapi.com/api/character/avatar/19.jpeg',
    type: '',
    ageRestriction: 'all'
  };

  const { 
    control, 
    handleSubmit, 
    formState: { errors }, 
    reset, 
    watch
  } = useForm({
    defaultValues: initialData || defaultForm
  });

  const navigate = useNavigate();
  const watchedImage = watch('image');
  const watchedAgeRestriction = watch('ageRestriction');

  // Cargar datos iniciales cuando se proporcionan
  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        originName: initialData.origin?.name || '',
        locationName: initialData.location?.name || ''
      });
    }
  }, [initialData, reset]);

  const onFormSubmit = async (data) => {
    const success = await onSubmit(data);
    if (success) {
      navigate(isEdit ? '/custom' : '/characters');
    }
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="bg-black dark:bg-black p-4 sm:p-6 rounded-lg shadow-lg max-w-full overflow-hidden">
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
        <label htmlFor="name" className="block text-white font-medium mb-2">Nombre*</label>
        <Controller
          name="name"
          control={control}
          rules={{ required: 'El nombre es obligatorio' }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              id="name"
              className={`w-full px-4 py-2 bg-black text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Nombre del personaje"
            />
          )}
        />
      </div>

      {/* SECCIÓN DE RESTRICCIÓN DE EDAD (Adaptada a temas) */}
      <div className="mb-6 p-4 border-2 border-dashed rounded-lg bg-white dark:bg-black">
        <h3 className="text-xl font-semibold text-cyan-600 dark:text-cyan-400 mb-3">Restricción de edad</h3>
        
        <div className="mb-2">
          <Controller
            name="ageRestriction"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-3">
                <label className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                  watchedAgeRestriction === 'all' 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  <input
                    type="radio"
                    {...field}
                    checked={field.value === 'all'}
                    value="all"
                    className="mr-3"
                  />
                  <div>
                    <span className="font-bold text-black dark:text-white">Para todos los públicos</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Todos los perfiles pueden ver este personaje</p>
                  </div>
                </label>
                
                <label className={`flex items-center p-3 border rounded-lg cursor-pointer ${
                  watchedAgeRestriction === 'adult' 
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  <input
                    type="radio"
                    {...field}
                    checked={field.value === 'adult'}
                    value="adult"
                    className="mr-3"
                  />
                  <div>
                    <span className="font-bold text-black dark:text-white">Solo para adultos</span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Este personaje no estará disponible para perfiles infantiles</p>
                  </div>
                </label>
              </div>
            )}
          />
        </div>
        
        {watchedAgeRestriction === 'adult' && (
          <div className="mt-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 p-3 rounded-md text-sm">
            ⚠️ Advertencia: Los perfiles infantiles no podrán ver este personaje.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="status" className="block text-white font-medium mb-2">Estado*</label>
          <Controller
            name="status"
            control={control}
            rules={{ required: 'El estado es obligatorio' }}
            render={({ field }) => (
              <select
                {...field}
                id="status"
                className={`w-full px-4 py-2 bg-black text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.status ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="Alive">Vivo</option>
                <option value="Dead">Muerto</option>
                <option value="unknown">Desconocido</option>
              </select>
            )}
          />
        </div>

        <div>
          <label htmlFor="species" className="block text-white font-medium mb-2">Especie*</label>
          <Controller
            name="species"
            control={control}
            rules={{ required: 'La especie es obligatoria' }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="species"
                className={`w-full px-4 py-2 bg-black text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.species ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Especie"
              />
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="gender" className="block text-white font-medium mb-2">Género*</label>
          <Controller
            name="gender"
            control={control}
            rules={{ required: 'El género es obligatorio' }}
            render={({ field }) => (
              <select
                {...field}
                id="gender"
                className={`w-full px-4 py-2 bg-black text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.gender ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="Male">Masculino</option>
                <option value="Female">Femenino</option>
                <option value="Genderless">Sin género</option>
                <option value="unknown">Desconocido</option>
              </select>
            )}
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-white font-medium mb-2">Tipo</label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="type"
                className="w-full px-4 py-2 bg-black text-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                placeholder="Tipo de personaje (opcional)"
              />
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="originName" className="block text-white font-medium mb-2">Origen*</label>
          <Controller
            name="originName"
            control={control}
            rules={{ required: 'El origen es obligatorio' }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="originName"
                className={`w-full px-4 py-2 bg-black text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.originName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Planeta o lugar de origen"
              />
            )}
          />
        </div>

        <div>
          <label htmlFor="locationName" className="block text-white font-medium mb-2">Ubicación actual*</label>
          <Controller
            name="locationName"
            control={control}
            rules={{ required: 'La ubicación es obligatoria' }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                id="locationName"
                className={`w-full px-4 py-2 bg-black text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.locationName ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Ubicación actual"
              />
            )}
          />
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="image" className="block text-white font-medium mb-2">URL de la imagen (opcional)</label>
        <Controller
          name="image"
          control={control}
          rules={{
            pattern: {
              value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))$/i,
              message: 'URL de imagen inválida (debe terminar en .png, .jpg, .jpeg o .gif)'
            }
          }}
          render={({ field }) => (
            <input
              {...field}
              type="text"
              id="image"
              className={`w-full px-4 py-2 bg-black text-white border rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 ${errors.image ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          )}
        />
        {watchedImage && (
          <div className="mt-2">
            <p className="text-white text-sm mb-2">Vista previa:</p>
            <img 
              src={watchedImage} 
              alt="Vista previa" 
              className="h-32 w-32 object-cover rounded-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://rickandmortyapi.com/api/character/avatar/19.jpeg';
              }}
            />
          </div>
        )}
        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-end gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full sm:w-auto px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          {isEdit ? 'Actualizar personaje' : 'Crear personaje'}
        </button>
      </div>
    </form>
  );
};

export default CharacterForm;