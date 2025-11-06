import { z } from 'zod';

export const createPostSchema = z.object({
  communityId: z.string().uuid().optional(),
  title: z.string().min(1, 'Title is required'),
  body: z.string().min(1, 'Body is required'),
});

export const updatePostSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  body: z.string().min(1, 'Body is required').optional(),
  locked: z.boolean().optional(),
});

export const postIdSchema = z.object({
  id: z.string().uuid('Invalid post ID'),
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PostIdInput = z.infer<typeof postIdSchema>;