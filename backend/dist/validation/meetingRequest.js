"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.meetingRequestIdSchema = exports.updateMeetingRequestSchema = exports.createMeetingRequestSchema = void 0;
const zod_1 = require("zod");
exports.createMeetingRequestSchema = zod_1.z.object({
    recipientId: zod_1.z.string().uuid('Invalid recipient ID'),
    message: zod_1.z.string().optional(),
    scheduledFor: zod_1.z.string().optional(),
});
exports.updateMeetingRequestSchema = zod_1.z.object({
    message: zod_1.z.string().optional(),
    scheduledFor: zod_1.z.string().optional(),
    status: zod_1.z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED']).optional(),
});
exports.meetingRequestIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid('Invalid meeting request ID'),
});
//# sourceMappingURL=meetingRequest.js.map