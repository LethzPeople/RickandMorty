import express from 'express';
import {
  getProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
  addFavorite,
  removeFavorite,
  getFavorites
} from '../controllers/profile.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Todas las rutas de perfiles están protegidas
router.use(protect);

router.route('/')
  .get(getProfiles)
  .post(createProfile);

router.route('/:id')
  .get(getProfileById)
  .put(updateProfile)
  .delete(deleteProfile);

router.get('/:id/favorites', getFavorites);
router.post('/:id/favorites/:characterId', addFavorite);
router.delete('/:id/favorites/:characterId', removeFavorite);

export default router;