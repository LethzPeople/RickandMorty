import Profile from '../models/Profile.js';
import Character from '../models/Character.js';
import axios from 'axios';

// @desc    Obtener todos los perfiles de un usuario
// @route   GET /api/profiles
// @access  Private
export const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({ user: req.user._id });
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener un perfil por ID
// @route   GET /api/profiles/:id
// @access  Private
export const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);

    // Verificar si el perfil existe y pertenece al usuario
    if (!profile) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    if (profile.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado para acceder a este perfil' });
    }

    // Obtener los personajes favoritos del perfil
    const favorites = await Character.find({
      _id: { $in: profile.favorites }
    });

    res.json({
      ...profile._doc,
      favorites
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Crear un nuevo perfil
// @route   POST /api/profiles
// @access  Private
export const createProfile = async (req, res) => {
  try {
    const { name, avatar, age, type } = req.body;

    // Verificar que el usuario no tenga más de 5 perfiles
    const profileCount = await Profile.countDocuments({ user: req.user._id });
    if (profileCount >= 5) {
      return res.status(400).json({ message: 'No puede crear más de 5 perfiles' });
    }

    const profile = await Profile.create({
      name,
      avatar: avatar || 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      user: req.user._id,
      age: age || (type === 'child' ? 12 : 18),
      type: type || 'adult',
      favorites: []
    });

    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Actualizar un perfil
// @route   PUT /api/profiles/:id
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, avatar, age, type } = req.body;
    
    const profile = await Profile.findById(req.params.id);

    // Verificar si el perfil existe y pertenece al usuario
    if (!profile) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    if (profile.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado para actualizar este perfil' });
    }

    // Actualizar los campos
    profile.name = name || profile.name;
    profile.avatar = avatar || profile.avatar;
    profile.age = age || profile.age;
    profile.type = type || profile.type;

    const updatedProfile = await profile.save();
    
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Eliminar un perfil
// @route   DELETE /api/profiles/:id
// @access  Private
export const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);

    // Verificar si el perfil existe y pertenece al usuario
    if (!profile) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    if (profile.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado para eliminar este perfil' });
    }

    // Verificar que no sea el último perfil del usuario
    const profileCount = await Profile.countDocuments({ user: req.user._id });
    if (profileCount <= 1) {
      return res.status(400).json({ message: 'No puede eliminar el último perfil' });
    }

    await profile.deleteOne();
    
    res.json({ message: 'Perfil eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Añadir un personaje a favoritos
// @route   POST /api/profiles/:id/favorites/:characterId
// @access  Private
export const addFavorite = async (req, res) => {
  try {
    console.log(`Añadiendo favorito: perfil=${req.params.id}, personaje=${req.params.characterId}`);
    
    const profile = await Profile.findById(req.params.id);
    const characterId = req.params.characterId;

    // Verificar si el perfil existe y pertenece al usuario
    if (!profile) {
      console.log('Perfil no encontrado');
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    if (profile.user.toString() !== req.user._id.toString()) {
      console.log('Usuario no autorizado');
      return res.status(403).json({ message: 'No autorizado para modificar este perfil' });
    }

    // Verificar si el ID es de la API externa (comienza con "api-")
    const isApiCharacter = characterId.startsWith('api-');
    console.log(`Tipo de personaje: ${isApiCharacter ? 'API externa' : 'Base de datos local'}`);

    if (!isApiCharacter) {
      // Verificar si el personaje existe solo para personajes de la base de datos
      const character = await Character.findById(characterId);
      if (!character) {
        console.log('Personaje no encontrado en la base de datos');
        return res.status(404).json({ message: 'Personaje no encontrado' });
      }

      // Verificar restricción de edad para perfiles infantiles
      if (profile.type === 'child' && character.ageRestriction === 'adult') {
        console.log('Personaje no disponible para perfiles infantiles');
        return res.status(403).json({ message: 'Este personaje no está disponible para perfiles infantiles' });
      }
    } else if (isApiCharacter && profile.type === 'child') {
      // Para personajes de la API, verificar restricción de edad si es necesario
      // En este caso podríamos hacer una solicitud a la API para comprobar, pero 
      // para simplificar, asumimos que es permitido.
      console.log('Personaje de API añadido a perfil infantil');
    }

    // Verificar si el personaje ya está en favoritos (considerando tanto strings como ObjectIds)
    const favoriteExists = profile.favorites.some(favId => {
      // Si es un ObjectId, convertir a string para comparación
      const favIdStr = favId.toString();
      return favIdStr === characterId;
    });

    if (favoriteExists) {
      console.log('El personaje ya está en favoritos');
      return res.status(400).json({ message: 'Este personaje ya está en favoritos' });
    }

    // Añadir a favoritos (guardamos el ID tal como viene)
    profile.favorites.push(characterId);
    await profile.save();
    console.log(`Personaje añadido a favoritos. Total favoritos: ${profile.favorites.length}`);

    res.json(profile);
  } catch (error) {
    console.error('Error al añadir a favoritos:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Eliminar un personaje de favoritos
// @route   DELETE /api/profiles/:id/favorites/:characterId
// @access  Private
export const removeFavorite = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    const characterId = req.params.characterId;

    // Verificar si el perfil existe y pertenece al usuario
    if (!profile) {
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    if (profile.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'No autorizado para modificar este perfil' });
    }

    // Verificar si el personaje está en favoritos
    if (!profile.favorites.includes(characterId)) {
      return res.status(400).json({ message: 'Este personaje no está en favoritos' });
    }

    // Eliminar de favoritos
    profile.favorites = profile.favorites.filter(id => id.toString() !== characterId);
    await profile.save();

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtener todos los favoritos de un perfil
// @route   GET /api/profiles/:id/favorites
// @access  Private
export const getFavorites = async (req, res) => {
  try {
    console.log(`Obteniendo favoritos para el perfil: ${req.params.id}`);
    
    const profile = await Profile.findById(req.params.id);

    // Verificar si el perfil existe y pertenece al usuario
    if (!profile) {
      console.log('Perfil no encontrado');
      return res.status(404).json({ message: 'Perfil no encontrado' });
    }

    if (profile.user.toString() !== req.user._id.toString()) {
      console.log('Usuario no autorizado');
      return res.status(403).json({ message: 'No autorizado para acceder a este perfil' });
    }

    console.log(`Número de favoritos: ${profile.favorites.length}`);
    
    // Separar IDs de la API externa y de la base de datos
    const apiIds = [];
    const dbIds = [];

    profile.favorites.forEach(id => {
      if (typeof id === 'string' && id.startsWith('api-')) {
        apiIds.push(id.split('-')[1]); // Extraer el número después de "api-"
      } else {
        dbIds.push(id);
      }
    });

    console.log(`IDs de base de datos: ${dbIds.length}, IDs de API: ${apiIds.length}`);

    // Obtener personajes de la base de datos
    const dbCharacters = dbIds.length > 0 
      ? await Character.find({ _id: { $in: dbIds } })
      : [];

    console.log(`Personajes de base de datos encontrados: ${dbCharacters.length}`);

    // Obtener personajes de la API externa
    let apiCharacters = [];
    if (apiIds.length > 0) {
      try {
        console.log(`Obteniendo personajes de la API con IDs: ${apiIds.join(',')}`);
        const apiUrl = `https://rickandmortyapi.com/api/character/${apiIds.join(',')}`;
        console.log(`URL de la API: ${apiUrl}`);
        
        const response = await axios.get(apiUrl);
        console.log('Respuesta de la API recibida');
        
        // Asegurarse de que la respuesta sea un array incluso si solo hay un personaje
        const apiData = Array.isArray(response.data) ? response.data : [response.data];
        
        // Convertir personajes de la API al formato de nuestro modelo
        apiCharacters = apiData.map(char => ({
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
          ageRestriction: char.id % 5 === 0 ? 'adult' : 'all',
        }));
        
        console.log(`Personajes de API obtenidos: ${apiCharacters.length}`);
        
        // Filtrar por restricción de edad si es perfil infantil
        if (profile.type === 'child') {
          apiCharacters = apiCharacters.filter(char => char.ageRestriction === 'all');
          console.log(`Personajes filtrados para perfil infantil: ${apiCharacters.length}`);
        }
      } catch (error) {
        console.error('Error al obtener personajes de la API:', error.message);
        console.error(error.stack);
      }
    }

    // Combinar resultados
    const favorites = [...dbCharacters, ...apiCharacters];
    console.log(`Total de favoritos a devolver: ${favorites.length}`);
    
    res.json(favorites);
  } catch (error) {
    console.error('Error al obtener favoritos:', error);
    console.error(error.stack);
    res.status(500).json({ message: error.message });
  }
};