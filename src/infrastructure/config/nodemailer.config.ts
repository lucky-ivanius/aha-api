import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const nodemailerConfigSchema = z.object({
  host: z.string().describe('Nodemailer Host'),
  port: z.string().transform(Number).describe('Nodemailer Port'),
  secure: z.string().transform(Boolean).describe('Nodemailer secure'),
  username: z.string().describe('Nodemailer username'),
  password: z.string().describe('Nodemailer password'),
});

export const nodemailerConfig = nodemailerConfigSchema.parse({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: process.env.MAIL_SECURE,
  username: process.env.MAIL_USERNAME,
  password: process.env.MAIL_PASSWORD,
});
