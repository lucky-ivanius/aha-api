import { z } from 'zod';

export const getUserDetailValidationSchema = z.object({
  userId: z
    .string({
      required_error: 'User ID is required',
      invalid_type_error: 'Invalid User ID',
    })
    .describe('User ID'),
});

export type GetUserDetailValidation = typeof getUserDetailValidationSchema;
