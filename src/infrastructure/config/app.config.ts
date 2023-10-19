import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const appConfigSchema = z.object({
  url: z.string(),
  isProduction: z.boolean().default(false),
});

export const appConfig = appConfigSchema.parse({
  url: process.env.APP_URL,
  isProduction: process.env.NODE_ENV === 'prod' ? true : false,
});
