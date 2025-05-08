import express from 'express';
import {
  getCharacters,
  getCharacterById,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  getRandomCharacters,
  searchCharacters
} from '../controllers/character.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { adminOnly } from '../middleware/role.middleware.js';

const router = express.Router();

// Middleware para añadir el perfil a la solicitud
const addProfileToReq = (req, res, next) => {
  if (req.query.profileId) {
    req.profile = { 
      _id: req.query.profileId,
      type: req.query.profileType || 'adult'
    };
  }
  next();
};

// Todas las rutas de personajes están protegidas
router.use(protect);
router.use(addProfileToReq);

router.route('/')
  .get(getCharacters)
  .post(createCharacter);

router.get('/random', getRandomCharacters);
router.get('/search', searchCharacters);

router.route('/:id')
  .get(getCharacterById)
  .put(updateCharacter)
  .delete(deleteCharacter);

export default router;