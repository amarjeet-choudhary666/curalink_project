import { z } from 'zod';

export const createPublicationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  abstract: z.string().optional(),
  authors: z.array(z.string()).default([]),
  journal: z.string().optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  doi: z.string().optional(),
  url: z.string().url().optional(),
  type: z.enum(['JOURNAL', 'PREPRINT', 'CONFERENCE', 'OTHER']).default('JOURNAL'),
  researcherId: z.string().uuid().optional(),
});

export const updatePublicationSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  abstract: z.string().optional(),
  authors: z.array(z.string()).optional(),
  journal: z.string().optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1).optional(),
  doi: z.string().optional(),
  url: z.string().url().optional(),
  type: z.enum(['JOURNAL', 'PREPRINT', 'CONFERENCE', 'OTHER']).optional(),
});

export const publicationIdSchema = z.object({
  id: z.string().uuid('Invalid publication ID'),
});

export type CreatePublicationInput = z.infer<typeof createPublicationSchema>;
export type UpdatePublicationInput = z.infer<typeof updatePublicationSchema>;
export type PublicationIdInput = z.infer<typeof publicationIdSchema>;