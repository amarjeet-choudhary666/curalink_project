import { z } from 'zod';

export const GeminiApiKeySchema = z.string().min(1, 'Gemini API key is required');