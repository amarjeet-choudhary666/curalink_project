import { Router } from 'express';
import {
  createPatientProfile,
  updatePatientProfile,
  getPatientProfile,
} from '../controllers/patientProfileController';
import { validateRequest } from '../middlewares/validation';
import { createPatientProfileSchema, updatePatientProfileSchema } from '../validation/patientProfile';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// Patient profile routes
router.post('/', authenticateToken, validateRequest(createPatientProfileSchema), createPatientProfile);
router.put('/:userId', authenticateToken, validateRequest(updatePatientProfileSchema), updatePatientProfile);
router.get('/:userId', authenticateToken, getPatientProfile);

export { router as patientProfileRoutes };