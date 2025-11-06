import { Router } from 'express';
import {
  createMeetingRequest,
  updateMeetingRequest,
  getMeetingRequestById,
  listUserMeetingRequests,
  acceptMeetingRequest,
  rejectMeetingRequest,
  createTestMeetingRequest,
} from '../controllers/meetingRequestController';
import { validateRequest, validateParams } from '../middlewares/validation';
import { createMeetingRequestSchema, updateMeetingRequestSchema, meetingRequestIdSchema } from '../validation/meetingRequest';
import { authenticateToken } from '../middlewares/auth';

const router = Router();

// Meeting request routes
router.post('/', authenticateToken, validateRequest(createMeetingRequestSchema), createMeetingRequest);
router.post('/test', createTestMeetingRequest); // Test endpoint
router.put('/:id', authenticateToken, validateParams(meetingRequestIdSchema), validateRequest(updateMeetingRequestSchema), updateMeetingRequest);
router.get('/:id', authenticateToken, validateParams(meetingRequestIdSchema), getMeetingRequestById);
router.get('/user/:userId', authenticateToken, listUserMeetingRequests);
router.put('/:id/accept', authenticateToken, validateParams(meetingRequestIdSchema), acceptMeetingRequest);
router.put('/:id/reject', authenticateToken, validateParams(meetingRequestIdSchema), rejectMeetingRequest);

export { router as meetingRequestRoutes };