import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const jwtConfigSchema = z.object({
  secret: z.string().describe('JWT Secret'),
  expiryHours: z.string().transform(Number).describe('JWT Expiry hours'),
});

export const jwtConfig = jwtConfigSchema.parse({
  secret: process.env.JWT_SECRET_KEY,
  expiryHours: process.env.JWT_EXPIRY_HOUR,
});
