import { Router } from 'express';
import {
  createReply,
  updateReply,
  getReplyById,
  listRepliesByPost,
} from '../controllers/replyController';
import { validateRequest, validateParams } from '../middlewares/validation';
import { createReplySchema, updateReplySchema, replyIdSchema } from '../validation/reply';
import { authenticateToken, optionalAuth } from '../middlewares/auth';

const router = Router();

// Reply routes
router.post('/', authenticateToken, validateRequest(createReplySchema), createReply);
router.put('/:id', authenticateToken, validateParams(replyIdSchema), validateRequest(updateReplySchema), updateReply);
router.get('/post/:postId', optionalAuth, listRepliesByPost);
router.get('/:id', optionalAuth, validateParams(replyIdSchema), getReplyById);

export { router as replyRoutes };