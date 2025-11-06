import { z } from 'zod';

export const favoriteTrialSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  trialId: z.string().uuid('Invalid trial ID'),
});

export const favoritePublicationSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  publicationId: z.string().uuid('Invalid publication ID'),
});

export const favoriteResearcherSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  researcherId: z.string().uuid('Invalid researcher ID'),
});

export type FavoriteTrialInput = z.infer<typeof favoriteTrialSchema>;
export type FavoritePublicationInput = z.infer<typeof favoritePublicationSchema>;
export type FavoriteResearcherInput = z.infer<typeof favoriteResearcherSchema>;