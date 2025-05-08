import axios from 'axios';
import Character from '../models/Character.js';

// Rick and Morty API base URL
const RICK_AND_MORTY_API = 'https://rickandmortyapi.com/api/character';

// @desc    Obtener todos los personajes (personalizados y de la API)
// @route   GET /api/characters
// @access  Private
export const getCharacters = async (req, res) => {
  try {
    const { name, page = 1, limit = 20, source = 'all' } = req.query;
    
    // Fix: Properly convert showAll string to boolean
    const showAll = req.query.showAll === 'true';
    
    // Agregar filtros adicionales
    const filter = {};
    
    // Si hay un término de búsqueda, agregar a los filtros
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    
    // Filtrar según la edad del perfil del usuario
    if (req.profile && req.profile.type === 'child') {
      filter.ageRestriction = 'all';
    }
    
    // Paginación
    const skip = (page - 1) * limit;
    
    // Obtener personajes personalizados si se solicitaron
    let characters = [];
    let totalCustom = 0;
    
    if (source === 'all' || source === 'custom') {
      // Obtener personajes creados por el usuario
      const customFilter = { ...filter, isCustom: true };
      
      // Si showAll es false o no se proporciona, solo mostrar personajes del usuario actual
      if (!showAll) {
        customFilter.creator = req.user._id;
      }
      
      const customCharacters = await Character.find(customFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('creator', 'name'); // Incluir información del creador
      
      totalCustom = await Character.countDocuments(customFilter);
      characters = [...customCharacters];
    }
    
    // Obtener personajes de la API externa si se solicitaron
    if ((source === 'all' || source === 'api') && name) {
      try {
        const response = await axios.get(`${RICK_AND_MORTY_API}/?name=${name}&page=${page}`);
        
        // Convertir personajes de la API al formato de nuestro modelo
        const apiCharacters = response.data.results.map(char => ({
          _id: `api-${char.id}`,
          name: char.name,
          status: char.status,
          species: char.species,
          type: char.type,
          gender: char.gender,
          origin: char.origin,
          location: char.location,
          image: char.image,
          created: char.created,
          apiId: char.id,
          isCustom: false,
          ageRestriction: char.id % 5 === 0 ? 'adult' : 'all', // Demo: 20% de personajes son para adultos
        }));
        
        // Filtrar personajes de la API para perfiles infantiles
        const filteredApiCharacters = req.profile && req.profile.type === 'child'
          ? apiCharacters.filter(char => char.ageRestriction === 'all')
          : apiCharacters;
        
        characters = [...characters, ...filteredApiCharacters];
      } catch (error) {
        console.log('Error al obtener personajes de la API:', error.message);
      }
    }
    
    res.json({
      characters,
      page: parseInt(page),
      pages: Math.ceil(totalCustom / limit),
      total: characters.length,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener un personaje por ID
// @route   GET /api/characters/:id
// @access  Private
export const getCharacterById = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Verificar si es un ID de la API
    if (id.startsWith('api-')) {
      const apiId = id.split('-')[1];
      
      try {
        const response = await axios.get(`${RICK_AND_MORTY_API}/${apiId}`);
        const char = response.data;
        
        // Convertir al formato de nuestro modelo
        const character = {
          _id: `api-${char.id}`,
          name: char.name,
          status: char.status,
          species: char.species,
          type: char.type,
          gender: char.gender,
          origin: char.origin,
          location: char.location,
          image: char.image,
          created: char.created,
          apiId: char.id,
          isCustom: false,
          ageRestriction: char.id % 5 === 0 ? 'adult' : 'all', // Demo: 20% de personajes son para adultos
        };
        
        // Verificar restricción de edad para perfiles infantiles
        if (req.profile && req.profile.type === 'child' && character.ageRestriction === 'adult') {
          return res.status(403).json({ message: 'Este personaje no está disponible para perfiles infantiles' });
        }
        
        return res.json(character);
      } catch (error) {
        return res.status(404).json({ message: 'Personaje no encontrado en la API' });
      }
    }
    
    // Buscar personaje en la base de datos
    const character = await Character.findById(id);
    
    if (!character) {
      return res.status(404).json({ message: 'Personaje no encontrado' });
    }
    
    // Verificar restricción de edad para perfiles infantiles
    if (req.profile && req.profile.type === 'child' && character.ageRestriction === 'adult') {
      return res.status(403).json({ message: 'Este personaje no está disponible para perfiles infantiles' });
    }
    
    res.json(character);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Crear un nuevo personaje
// @route   POST /api/characters
// @access  Private
export const createCharacter = async (req, res) => {
  try {
    const {
      name,
      status,
      species,
      type,
      gender,
      originName,
      locationName,
      image,
      ageRestriction
    } = req.body;
    
    // Crear el nuevo personaje
    const character = await Character.create({
      name,
      status: status || 'Alive',
      species,
      type: type || '',
      gender: gender || 'unknown',
      origin: {
        name: originName || 'unknown',
        url: ''
      },
      location: {
        name: locationName || 'unknown',
        url: ''
      },
      image: image || 'https://rickandmortyapi.com/api/character/avatar/19.jpeg',
      created: new Date(),
      creator: req.user._id,
      isCustom: true,
      ageRestriction: ageRestriction || 'all'
    });
    
    res.status(201).json(character);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Actualizar un personaje
// @route   PUT /api/characters/:id
// @access  Private
export const updateCharacter = async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    
    // Verificar si el personaje existe
    if (!character) {
      return res.status(404).json({ message: 'Personaje no encontrado' });
    }
    
    // Verificar si el usuario tiene permiso para actualizar
    if (character.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado para actualizar este personaje' });
    }
    
    // Actualizar los campos
    const {
      name,
      status,
      species,
      type,
      gender,
      originName,
      locationName,
      image,
      ageRestriction
    } = req.body;
    
    character.name = name || character.name;
    character.status = status || character.status;
    character.species = species || character.species;
    character.type = type !== undefined ? type : character.type;
    character.gender = gender || character.gender;
    character.origin.name = originName || character.origin.name;
    character.location.name = locationName || character.location.name;
    character.image = image || character.image;
    character.ageRestriction = ageRestriction || character.ageRestriction;
    
    const updatedCharacter = await character.save();
    
    res.json(updatedCharacter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Eliminar un personaje
// @route   DELETE /api/characters/:id
// @access  Private
export const deleteCharacter = async (req, res) => {
  try {
    const character = await Character.findById(req.params.id);
    
    // Verificar si el personaje existe
    if (!character) {
      return res.status(404).json({ message: 'Personaje no encontrado' });
    }
    
    // Verificar si el usuario tiene permiso para eliminar
    if (character.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'No autorizado para eliminar este personaje' });
    }
    
    await character.deleteOne();
    
    res.json({ message: 'Personaje eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener personajes aleatorios
// @route   GET /api/characters/random
// @access  Private
export const getRandomCharacters = async (req, res) => {
  try {
    const { count = 5 } = req.query;
    const limit = Math.min(parseInt(count), 20); // Limitar a 20 personajes
    
    // Generar IDs aleatorios para la API
    const randomIds = Array.from({ length: limit }, () => Math.floor(Math.random() * 826) + 1);
    
    try {
      const response = await axios.get(`${RICK_AND_MORTY_API}/${randomIds}`);
      let characters = Array.isArray(response.data) ? response.data : [response.data];
      
      // Convertir personajes de la API al formato de nuestro modelo
      characters = characters.map(char => ({
        _id: `api-${char.id}`,
        name: char.name,
        status: char.status,
        species: char.species,
        type: char.type,
        gender: char.gender,
        origin: char.origin,
        location: char.location,
        image: char.image,
        created: char.created,
        apiId: char.id,
        isCustom: false,
        ageRestriction: char.id % 5 === 0 ? 'adult' : 'all', // Demo: 20% de personajes son para adultos
      }));
      
      // Filtrar personajes para perfiles infantiles
      if (req.profile && req.profile.type === 'child') {
        characters = characters.filter(char => char.ageRestriction === 'all');
      }
      
      res.json(characters);
    } catch (error) {
      res.status(400).json({ message: 'Error al obtener personajes aleatorios' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Buscar personajes
// @route   GET /api/characters/search
// @access  Private
export const searchCharacters = async (req, res) => {
  try {
    // Fix: Properly convert showAll string to boolean
    const { name } = req.query;
    const showAll = req.query.showAll === 'true';
    
    if (!name || name.trim() === '') {
      return res.status(400).json({ message: 'Se requiere un término de búsqueda' });
    }
    
    // Buscar en la base de datos local
    const filter = { 
      name: { $regex: name, $options: 'i' },
      isCustom: true
    };
    
    // Si showAll es false y no es admin, solo personajes del usuario
    if (!showAll && req.user.role !== 'admin') {
      filter.creator = req.user._id;
    }
    
    // Filtrar según la edad del perfil del usuario
    if (req.profile && req.profile.type === 'child') {
      filter.ageRestriction = 'all';
    }
    
    const localCharacters = await Character.find(filter)
      .populate('creator', 'name'); // Incluir información del creador
    
    // Buscar en la API externa
    let apiCharacters = [];
    try {
      const response = await axios.get(`${RICK_AND_MORTY_API}/?name=${name}`);
      
      apiCharacters = response.data.results.map(char => ({
        _id: `api-${char.id}`,
        name: char.name,
        status: char.status,
        species: char.species,
        type: char.type,
        gender: char.gender,
        origin: char.origin,
        location: char.location,
        image: char.image,
        created: char.created,
        apiId: char.id,
        isCustom: false,
        ageRestriction: char.id % 5 === 0 ? 'adult' : 'all', // Demo: 20% de personajes son para adultos
      }));
      
      // Filtrar personajes de la API para perfiles infantiles
      if (req.profile && req.profile.type === 'child') {
        apiCharacters = apiCharacters.filter(char => char.ageRestriction === 'all');
      }
    } catch (error) {
      console.log('Error al buscar en la API:', error.message);
    }
    
    // Combinar resultados
    const results = [...localCharacters, ...apiCharacters];
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};