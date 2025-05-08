/**
 * Utilidades para mejorar la responsividad de la aplicación
 */

// Aplicar todas las correcciones de CSS para solucionar problemas responsivos
export const applyResponsiveFixes = () => {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    /* Correcciones generales */
    body {
      overflow-x: hidden;
    }

    /* Asegurar que los inputs no se desborden en móviles */
    input, select, textarea {
      max-width: 100%;
      box-sizing: border-box;
    }

    /* Prevenir desbordamiento de texto largo */
    .text-ellipsis {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    
    /* Ajustar formularios para móviles */
    @media (max-width: 640px) {
      /* Corregir tarjetas de personajes */
      .overflow-hidden {
        max-width: 100vw;
      }
      
      /* Botones más pequeños en móvil */
      .mt-4.flex.justify-between button,
      .mt-4.flex.justify-between a {
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
      }
      
      /* Correcciones para formularios */
      input[type="text"],
      input[type="email"],
      input[type="password"],
      input[type="number"],
      select {
        width: 100%;
        font-size: 16px; /* Prevenir zoom en iOS */
      }
      
      /* Correcciones para tarjetas de personajes */
      .grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3.xl\\:grid-cols-4.gap-6 > div {
        max-width: 100%;
      }
      
      /* Asegurar que los botones de acción quepan */
      .flex.space-x-2, 
      .flex.space-x-3, 
      .flex.space-x-4 {
        flex-wrap: wrap;
        gap: 0.5rem;
      }
      
      /* Asegurar que el formulario de búsqueda se ajuste correctamente */
      .bg-black.p-6.rounded-lg.shadow-md.mb-6 .flex {
        flex-direction: column;
      }
      
      .bg-black.p-6.rounded-lg.shadow-md.mb-6 .flex input {
        width: 100%;
        border-radius: 0.375rem;
        margin-bottom: 0.5rem;
      }
      
      .bg-black.p-6.rounded-lg.shadow-md.mb-6 .flex button {
        width: 100%;
        border-radius: 0.375rem;
      }
      
      /* Mejorar visualización de botones en formularios */
      form .flex.justify-end.space-x-4 {
        flex-direction: column;
        gap: 0.5rem;
      }
      
      form .flex.justify-end.space-x-4 button {
        width: 100%;
      }
    }
  `;
  
  document.head.appendChild(styleElement);
};

// Ajustar un texto para que no desborde los contenedores
export const truncateText = (text, maxLength = 20) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};