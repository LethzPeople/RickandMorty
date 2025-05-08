import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const Register = () => {
  const { 
    control, 
    handleSubmit, 
    watch,
    formState: { errors, isSubmitting } 
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });

  // Watch password para validación
  const password = watch('password');
  
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/profiles');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    try {
      await register(data.name, data.email, data.password);
      navigate('/profiles');
    } catch (error) {
      console.error('Error al registrarse:', error);
      // No es necesario mostrar toast aquí ya que register() ya lo muestra
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-black/90 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-black p-10 rounded-lg shadow-2xl border border-green-400">
        <div>
          <img className="mx-auto h-24 w-auto" src={logo} alt="Rick and Morty" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-cyan-400">
            Crear cuenta
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Nombre</label>
              <Controller
                name="name"
                control={control}
                rules={{ 
                  required: 'El nombre es obligatorio',
                  minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    id="name"
                    type="text"
                    autoComplete="name"
                    className="appearance-none rounded-t-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-white bg-black rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm mb-4"
                    placeholder="Nombre completo"
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mb-2">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">Email</label>
              <Controller
                name="email"
                control={control}
                rules={{ 
                  required: 'El email es obligatorio',
                  pattern: { 
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                    message: 'Ingresa un email válido' 
                  }
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    id="email-address"
                    type="email"
                    autoComplete="email"
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-white bg-black rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm mb-4"
                    placeholder="Email"
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mb-2">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Contraseña</label>
              <Controller
                name="password"
                control={control}
                rules={{ 
                  required: 'La contraseña es obligatoria',
                  minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' }
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-white bg-black rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm mb-4"
                    placeholder="Contraseña (mínimo 6 caracteres)"
                  />
                )}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mb-2">{errors.password.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="confirm-password" className="sr-only">Confirmar contraseña</label>
              <Controller
                name="confirmPassword"
                control={control}
                rules={{ 
                  required: 'Por favor confirma la contraseña',
                  validate: value => value === password || 'Las contraseñas no coinciden'
                }}
                render={({ field }) => (
                  <input
                    {...field}
                    id="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    className="appearance-none rounded-b-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-white bg-black rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                    placeholder="Confirmar contraseña"
                  />
                )}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <Link to="/login" className="font-medium text-green-400 hover:text-green-300">
                Inicia sesión
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;