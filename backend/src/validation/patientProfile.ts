import { z } from 'zod';

export const createPatientProfileSchema = z.object({
  userId: z.string().uuid('Invalid user ID'),
  conditions: z.array(z.string()).default([]),
  about: z.string().optional(),
  preferRemote: z.boolean().default(false),
  preferences: z.any().optional(),
});

export const updatePatientProfileSchema = z.object({
  conditions: z.array(z.string()).optional(),
  about: z.string().optional(),
  preferRemote: z.boolean().optional(),
  preferences: z.any().optional(),
});

export type CreatePatientProfileInput = z.infer<typeof createPatientProfileSchema>;
export type UpdatePatientProfileInput = z.infer<typeof updatePatientProfileSchema>;