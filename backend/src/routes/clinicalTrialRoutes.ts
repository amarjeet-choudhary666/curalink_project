import { Router } from 'express';
import {
  createClinicalTrial,
  updateClinicalTrial,
  getClinicalTrialById,
  searchClinicalTrials,
  listClinicalTrials,
} from '../controllers/clinicalTrialController';
import { validateRequest, validateParams } from '../middlewares/validation';
import { createClinicalTrialSchema, updateClinicalTrialSchema, trialIdSchema } from '../validation/clinicalTrial';
import { authenticateToken, requireRole, optionalAuth } from '../middlewares/auth';

const router = Router();

// Clinical trial routes
router.post('/', authenticateToken, requireRole(['RESEARCHER']), validateRequest(createClinicalTrialSchema), createClinicalTrial);
router.put('/:id', authenticateToken, requireRole(['RESEARCHER']), validateParams(trialIdSchema), validateRequest(updateClinicalTrialSchema), updateClinicalTrial);
router.get('/search', optionalAuth, searchClinicalTrials);
router.get('/', optionalAuth, listClinicalTrials);
router.get('/:id', optionalAuth, validateParams(trialIdSchema), getClinicalTrialById);

export { router as clinicalTrialRoutes };