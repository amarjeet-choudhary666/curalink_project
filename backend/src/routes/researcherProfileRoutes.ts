import { Router } from 'express';
import {
  createResearcherProfile,
  updateResearcherProfile,
  getResearcherProfile,
  listResearchers,
  importPublications,
} from '../controllers/researcherProfileController';
import { validateRequest } from '../middlewares/validation';
import { createResearcherProfileSchema, updateResearcherProfileSchema } from '../validation/researcherProfile';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// Researcher profile routes
router.get('/', listResearchers); // Public endpoint to list researchers
router.post('/', authenticateToken, validateRequest(createResearcherProfileSchema), createResearcherProfile);
router.put('/:userId', authenticateToken, validateRequest(updateResearcherProfileSchema), updateResearcherProfile);
router.get('/:userId', authenticateToken, getResearcherProfile);
router.post('/:userId/import-publications', authenticateToken, importPublications);

export { router as researcherProfileRoutes };