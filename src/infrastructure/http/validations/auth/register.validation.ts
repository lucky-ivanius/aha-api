import { z } from 'zod';

export const registerValidationSchema = z.object({
  name: z
    .string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    })
    .min(2, {
      message: 'Name must be contain at least 2 characters',
    })
    .trim()
    .describe('Name'),
  email: z
    .string({
      required_error: 'Email is required',
      invalid_type_error: 'Email must be a string',
    })
    .email()
    .trim()
    .describe('Email'),
  password: z.string().describe('Password'),
});

export type RegisterValidation = typeof registerValidationSchema;
