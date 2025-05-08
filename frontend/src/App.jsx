import React, { useEffect } from 'react';
import AppRouter from './router/AppRouter';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'sweetalert2/dist/sweetalert2.min.css';
import { applyResponsiveFixes } from './utils/responsive-utils';
import { applyPixelStyles } from './utils/pixel-styles';

function App() {
  // Aplicar todos los arreglos de estilo al cargar la aplicación
  useEffect(() => {
    // Arreglos responsivos generales
    applyResponsiveFixes();
    
    // Estilos específicos para fuente pixel
    applyPixelStyles();
    
    // Verificar que la fuente Press Start 2P esté cargada
    const fontLink = document.querySelector('link[href*="Press+Start+2P"]');
    if (!fontLink) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
      document.head.appendChild(link);
    }
    
    // Desactivar zoom en dispositivos móviles
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      metaViewport.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
    }
  }, []);

  return (
    <>
      <AppRouter />
      <ToastContainer 
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </>
  );
}

export default App;

