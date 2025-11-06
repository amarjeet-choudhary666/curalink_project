import { z } from 'zod';

export const createMeetingRequestSchema = z.object({
  recipientId: z.string().uuid('Invalid recipient ID'),
  message: z.string().optional(),
  scheduledFor: z.string().optional(),
});

export const updateMeetingRequestSchema = z.object({
  message: z.string().optional(),
  scheduledFor: z.string().optional(),
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED']).optional(),
});

export const meetingRequestIdSchema = z.object({
  id: z.string().uuid('Invalid meeting request ID'),
});

export type CreateMeetingRequestInput = z.infer<typeof createMeetingRequestSchema>;
export type UpdateMeetingRequestInput = z.infer<typeof updateMeetingRequestSchema>;
export type MeetingRequestIdInput = z.infer<typeof meetingRequestIdSchema>;