import { Router } from 'express';
import {
  createPublication,
  updatePublication,
  getPublicationById,
  searchPublications,
  listPublications,
} from '../controllers/publicationController';
import { validateRequest, validateParams } from '../middlewares/validation';
import { createPublicationSchema, updatePublicationSchema, publicationIdSchema } from '../validation/publication';
import { authenticateToken, requireRole, optionalAuth } from '../middlewares/auth';

const router = Router();

// Publication routes
router.post('/', authenticateToken, requireRole(['RESEARCHER']), validateRequest(createPublicationSchema), createPublication);
router.put('/:id', authenticateToken, requireRole(['RESEARCHER']), validateParams(publicationIdSchema), validateRequest(updatePublicationSchema), updatePublication);
router.get('/search', optionalAuth, searchPublications);
router.get('/', optionalAuth, listPublications);
router.get('/:id', optionalAuth, validateParams(publicationIdSchema), getPublicationById);

export { router as publicationRoutes };