import React from 'react';
import { useCharacters } from '../context/CharacterContext';
import CharacterForm from '../components/CharacterForm';

const CharacterCreate = () => {
  const { createCharacter } = useCharacters();

  const handleCreate = async (formData) => {
    return await createCharacter(formData);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-cyan-400 mb-6">Crear nuevo personaje</h1>
      <p className="text-white mb-6">
        ¡Crea tu propio personaje del universo de Rick and Morty! Completa el formulario con los detalles de tu personaje.
      </p>
      
      <CharacterForm onSubmit={handleCreate} />
    </div>
  );
};

export default CharacterCreate;