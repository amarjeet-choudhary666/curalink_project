"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meetingRequestRoutes = void 0;
const express_1 = require("express");
const meetingRequestController_1 = require("../controllers/meetingRequestController");
const validation_1 = require("../middlewares/validation");
const meetingRequest_1 = require("../validation/meetingRequest");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
exports.meetingRequestRoutes = router;
// Meeting request routes
router.post('/', auth_1.authenticateToken, (0, validation_1.validateRequest)(meetingRequest_1.createMeetingRequestSchema), meetingRequestController_1.createMeetingRequest);
router.post('/test', meetingRequestController_1.createTestMeetingRequest); // Test endpoint
router.put('/:id', auth_1.authenticateToken, (0, validation_1.validateParams)(meetingRequest_1.meetingRequestIdSchema), (0, validation_1.validateRequest)(meetingRequest_1.updateMeetingRequestSchema), meetingRequestController_1.updateMeetingRequest);
router.get('/:id', auth_1.authenticateToken, (0, validation_1.validateParams)(meetingRequest_1.meetingRequestIdSchema), meetingRequestController_1.getMeetingRequestById);
router.get('/user/:userId', auth_1.authenticateToken, meetingRequestController_1.listUserMeetingRequests);
router.put('/:id/accept', auth_1.authenticateToken, (0, validation_1.validateParams)(meetingRequest_1.meetingRequestIdSchema), meetingRequestController_1.acceptMeetingRequest);
router.put('/:id/reject', auth_1.authenticateToken, (0, validation_1.validateParams)(meetingRequest_1.meetingRequestIdSchema), meetingRequestController_1.rejectMeetingRequest);
//# sourceMappingURL=meetingRequestRoutes.js.map