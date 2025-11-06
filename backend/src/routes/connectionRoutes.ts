import { Router } from 'express';
import {
  createConnectionRequest,
  updateConnectionStatus,
  getConnectionById,
  listUserConnections,
  acceptConnection,
  rejectConnection,
} from '../controllers/connectionController';
import { validateRequest, validateParams } from '../middlewares/validation';
import { createConnectionSchema, updateConnectionSchema, connectionIdSchema } from '../validation/connection';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// Connection routes
router.post('/', authenticateToken, validateRequest(createConnectionSchema), createConnectionRequest);
router.put('/:id', authenticateToken, validateParams(connectionIdSchema), validateRequest(updateConnectionSchema), updateConnectionStatus);
router.get('/:id', authenticateToken, validateParams(connectionIdSchema), getConnectionById);
router.get('/user/:userId', authenticateToken, listUserConnections);
router.put('/:id/accept', authenticateToken, validateParams(connectionIdSchema), acceptConnection);
router.put('/:id/reject', authenticateToken, validateParams(connectionIdSchema), rejectConnection);

export { router as connectionRoutes };