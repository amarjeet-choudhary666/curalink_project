import { Router } from 'express';
import {
  addFavoriteTrial,
  removeFavoriteTrial,
  addFavoritePublication,
  removeFavoritePublication,
  addFavoriteResearcher,
  removeFavoriteResearcher,
  getUserFavorites,
} from '../controllers/favoritesController';
import { validateRequest } from '../middlewares/validation';
import { favoriteTrialSchema, favoritePublicationSchema, favoriteResearcherSchema } from '../validation/favorites';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// Favorites routes
router.post('/trials', authenticateToken, validateRequest(favoriteTrialSchema), addFavoriteTrial);
router.delete('/trials/:userId/:trialId', authenticateToken, removeFavoriteTrial);
router.post('/publications', authenticateToken, validateRequest(favoritePublicationSchema), addFavoritePublication);
router.delete('/publications/:userId/:publicationId', authenticateToken, removeFavoritePublication);
router.post('/researchers', authenticateToken, validateRequest(favoriteResearcherSchema), addFavoriteResearcher);
router.delete('/researchers/:userId/:researcherId', authenticateToken, removeFavoriteResearcher);
router.get('/user/:userId', authenticateToken, getUserFavorites);

export { router as favoritesRoutes };