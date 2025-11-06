import { z } from 'zod';

export const createClinicalTrialSchema = z.object({
  externalId: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  summary: z.string().optional(),
  eligibility: z.string().optional(),
  phase: z.enum(['PHASE_0', 'PHASE_1', 'PHASE_2', 'PHASE_3', 'PHASE_4', 'N_A']).default('N_A'),
  status: z.enum(['RECRUITING', 'ACTIVE_NOT_RECRUITING', 'COMPLETED', 'TERMINATED', 'UNKNOWN']).default('UNKNOWN'),
  locations: z.array(z.string()).default([]),
  contactEmail: z.string().email().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  ownerId: z.string().uuid().optional(),
  externalUrl: z.string().url().optional(),
  tags: z.array(z.string()).default([]),
});

export const updateClinicalTrialSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  summary: z.string().optional(),
  eligibility: z.string().optional(),
  phase: z.enum(['PHASE_0', 'PHASE_1', 'PHASE_2', 'PHASE_3', 'PHASE_4', 'N_A']).optional(),
  status: z.enum(['RECRUITING', 'ACTIVE_NOT_RECRUITING', 'COMPLETED', 'TERMINATED', 'UNKNOWN']).optional(),
  locations: z.array(z.string()).optional(),
  contactEmail: z.string().email().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  externalUrl: z.string().url().optional(),
  tags: z.array(z.string()).optional(),
});

export const trialIdSchema = z.object({
  id: z.string().uuid('Invalid trial ID'),
});

export type CreateClinicalTrialInput = z.infer<typeof createClinicalTrialSchema>;
export type UpdateClinicalTrialInput = z.infer<typeof updateClinicalTrialSchema>;
export type TrialIdInput = z.infer<typeof trialIdSchema>;