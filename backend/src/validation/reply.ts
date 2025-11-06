import { z } from 'zod';

export const createReplySchema = z.object({
  postId: z.string().uuid('Invalid post ID'),
  body: z.string().min(1, 'Reply body is required'),
});

export const updateReplySchema = z.object({
  body: z.string().min(1, 'Reply body is required').optional(),
});

export const replyIdSchema = z.object({
  id: z.string().uuid('Invalid reply ID'),
});

export type CreateReplyInput = z.infer<typeof createReplySchema>;
export type UpdateReplyInput = z.infer<typeof updateReplySchema>;
export type ReplyIdInput = z.infer<typeof replyIdSchema>;