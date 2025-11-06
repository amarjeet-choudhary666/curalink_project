import { Router } from 'express';
import {
  createPost,
  updatePost,
  getPostById,
  listPostsByCommunity,
  listAllPosts,
} from '../controllers/postController';
import { validateRequest, validateParams } from '../middlewares/validation';
import { createPostSchema, updatePostSchema, postIdSchema } from '../validation/post';
import { authenticateToken, optionalAuth } from '../middlewares/auth';

const router = Router();

// Post routes
router.post('/', authenticateToken, validateRequest(createPostSchema), createPost);
router.put('/:id', authenticateToken, validateParams(postIdSchema), validateRequest(updatePostSchema), updatePost);
router.get('/', optionalAuth, listAllPosts);
router.get('/community/:communitySlug', optionalAuth, listPostsByCommunity);
router.get('/:id', optionalAuth, validateParams(postIdSchema), getPostById);

export { router as postRoutes };