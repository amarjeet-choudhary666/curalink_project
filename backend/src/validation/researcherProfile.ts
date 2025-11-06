import { z } from 'zod';

export const createResearcherProfileSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  specialties: z.array(z.string()).default([]),
  interests: z.array(z.string()).default([]),
  orcid: z.string().optional(),
  researchgate: z.string().optional(),
  availability: z.boolean().default(true),
  meta: z.any().optional(),
});

export const updateResearcherProfileSchema = z.object({
  specialties: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  orcid: z.string().optional(),
  researchgate: z.string().optional(),
  availability: z.boolean().optional(),
  meta: z.any().optional(),
});

export type CreateResearcherProfileInput = z.infer<typeof createResearcherProfileSchema>;
export type UpdateResearcherProfileInput = z.infer<typeof updateResearcherProfileSchema>;