/**
 * Aplica estilos para el estilo de fuente pixel art
 * Complementa los arreglos responsivos con estilos específicos para la tipografía
 */

export const applyPixelStyles = () => {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    /* Estilos para texto pixel art */
    .text-green-400, .text-cyan-400 {
      font-family: 'Press Start 2P', cursive;
      text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.8);
    }
    
    /* Mejoras para títulos principales */
    h1.text-4xl, h1.text-3xl, h2.text-2xl {
      font-family: 'Press Start 2P', cursive;
      letter-spacing: -0.05em;
      line-height: 1.3;
    }
    
    /* Estilos para botones principales */
    .bg-green-600.text-white, .bg-green-600.text-black {
      font-family: 'Press Start 2P', cursive;
      font-size: 0.85rem;
      letter-spacing: -0.05em;
      box-shadow: 2px 2px 0px rgba(0, 0, 0, 0.3);
    }
    
    /* Ajuste de espaciado para botones */
    .mt-4.flex.flex-wrap.justify-between {
      gap: 0.5rem;
    }
    
    /* Estilo pixel para botones específicos */
    .custom-pixel-button {
      font-family: 'Press Start 2P', cursive;
      font-size: 0.75rem;
      padding: 0.5rem 0.75rem;
      border: 2px solid #22c55e;
      box-shadow: 2px 2px 0px #000;
    }
    
    /* Media queries para ajustes responsivos */
    @media (max-width: 640px) {
      .text-green-400, .text-cyan-400 {
        font-size: 0.9em;
      }
      
      h1.text-4xl, h1.text-3xl {
        font-size: 1.5rem;
        line-height: 1.4;
      }
      
      .custom-pixel-button, .bg-green-600.text-white, .bg-green-600.text-black {
        font-size: 0.7rem;
        padding: 0.4rem 0.6rem;
      }
    }
  `;
  
  document.head.appendChild(styleElement);
};

// Función para aplicar estilo pixel a un texto
export const pixelifyText = (text, color = 'green') => {
  const colorClass = color === 'green' ? 'text-green-400' : 'text-cyan-400';
  return `<span class="${colorClass} pixel-text">${text}</span>`;
};