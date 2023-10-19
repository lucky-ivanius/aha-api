import dotenv from 'dotenv';
import { z } from 'zod';
import { appConfig } from './app.config';

dotenv.config();

const apiConfigSchema = z.object({
  port: z.string().transform(Number).describe('Application port'),
  origin: z.union([z.string(), z.array(z.string())]).describe('CORS origins'),
});

export const apiConfig = apiConfigSchema.parse({
  port: process.env.PORT,
  origin: appConfig.isProduction ? process.env.ORIGIN : '*',
});
