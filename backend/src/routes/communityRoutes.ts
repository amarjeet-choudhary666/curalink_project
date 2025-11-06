import { Router } from 'express';
import {
  createCommunity,
  updateCommunity,
  getCommunityBySlug,
  listCommunities,
} from '../controllers/communityController';
import { validateRequest, validateParams } from '../middlewares/validation';
import { createCommunitySchema, updateCommunitySchema, communityIdSchema } from '../validation/community';
import { authenticateToken, requireRole, optionalAuth } from '../middlewares/auth';

const router = Router();

// Community routes
router.post('/', authenticateToken, requireRole(['RESEARCHER', 'ADMIN', 'PATIENT']), validateRequest(createCommunitySchema), createCommunity);
router.put('/:slug', authenticateToken, requireRole(['RESEARCHER', 'ADMIN']), validateParams(communityIdSchema), validateRequest(updateCommunitySchema), updateCommunity);
router.get('/', optionalAuth, listCommunities);
router.get('/:slug', optionalAuth, validateParams(communityIdSchema), getCommunityBySlug);

export { router as communityRoutes };