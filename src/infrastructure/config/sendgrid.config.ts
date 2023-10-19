import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const sendGridConfigSchema = z.object({
  apiKey: z.string().describe('SendGrid API Key'),
  noReplyEmail: z.string().email().describe('SendGrid no-reply email'),
});

export const sendGridConfig = sendGridConfigSchema.parse({
  apiKey: process.env.SENDGRID_API_KEY,
  noReplyEmail: process.env.SENDGRID_NOREPLY_EMAIL,
});
