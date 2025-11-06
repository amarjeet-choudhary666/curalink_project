import { Router } from 'express';
import {
  createUser,
  updateUser,
  getUserById,
  loginUser,
  logoutUser,
} from '../controllers/userController';
import { validateRequest, validateParams } from '../middlewares/validation';
import { createUserSchema, updateUserSchema, userIdSchema, loginSchema } from '../validation/user';

const router = Router();

// User routes
router.post('/', validateRequest(createUserSchema), createUser);
router.post('/login', validateRequest(loginSchema), loginUser);
router.post('/logout', logoutUser);
router.put('/:id', validateParams(userIdSchema), validateRequest(updateUserSchema), updateUser);
router.get('/:id', validateParams(userIdSchema), getUserById);

export { router as userRoutes };