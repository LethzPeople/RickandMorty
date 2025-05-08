import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black/90 text-white py-1 mt-auto flex items-center justify-center">
      <div className="container mx-auto px-4 py-4">
        <div className="text-center text-sm text-gray-400">
          <p>&copy; {currentYear} Rick And Morty Explorer | <a href="https://rickandmortyapi.com/" className="underline hover:text-white" target="_blank" rel="noopener noreferrer">API de Rick y Morty</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

