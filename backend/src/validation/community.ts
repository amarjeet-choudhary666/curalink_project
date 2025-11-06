import { z } from 'zod';

export const createCommunitySchema = z.object({
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  createdBy: z.string().uuid().optional(),
});

export const updateCommunitySchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
});

export const communityIdSchema = z.object({
  slug: z.string().min(1, 'Community slug is required'),
});

export type CreateCommunityInput = z.infer<typeof createCommunitySchema>;
export type UpdateCommunityInput = z.infer<typeof updateCommunitySchema>;
export type CommunityIdInput = z.infer<typeof communityIdSchema>;