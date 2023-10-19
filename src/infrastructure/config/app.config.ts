import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const appConfigSchema = z.object({
  isProduction: z.boolean().default(false),
});

export const appConfig = appConfigSchema.parse({
  isProduction: process.env.NODE_ENV === 'prod' ? true : false,
});
