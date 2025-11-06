import { z } from 'zod';

export const createConnectionSchema = z.object({
  targetId: z.string().uuid('Invalid target user ID'),
});

export const updateConnectionSchema = z.object({
  status: z.enum(['PENDING', 'CONNECTED', 'REJECTED']).optional(),
});

export const connectionIdSchema = z.object({
  id: z.string().uuid('Invalid connection ID'),
});

export type CreateConnectionInput = z.infer<typeof createConnectionSchema>;
export type UpdateConnectionInput = z.infer<typeof updateConnectionSchema>;
export type ConnectionIdInput = z.infer<typeof connectionIdSchema>;