import { z } from 'zod';

export const loginValidationSchema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .toLowerCase()
    .trim()
    .describe('Email'),
  password: z.string().describe('Password'),
});

export type LoginValidation = typeof loginValidationSchema;
