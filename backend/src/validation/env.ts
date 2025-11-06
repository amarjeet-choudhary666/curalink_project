import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.string().transform(Number).pipe(z.number().int().positive()),
  PGHOST: z.string().min(1),
  PGDATABASE: z.string().min(1),
  PGUSER: z.string().min(1),
  PGPASSWORD: z.string().min(1),
  ENDPOINT_ID: z.string().min(1),
  DATABASE_URL: z.string().url(),
  GEMINI_API_KEY: z.string().min(1, 'Gemini API key is required'),
});

export type EnvVars = z.infer<typeof envSchema>;