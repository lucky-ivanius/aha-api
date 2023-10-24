import { z } from 'zod';

export const verifyEmailValidationSchema = z.object({
  verifyToken: z.string({
    required_error: 'Token is required',
    invalid_type_error: 'Invalid token',
  }),
});

export type VerifyEmailValidation = typeof verifyEmailValidationSchema;
