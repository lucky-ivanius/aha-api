import { z } from 'zod';

export const updateNameValidationSchema = z.object({
  userId: z
    .string({
      required_error: 'User ID is required',
      invalid_type_error: 'Invalid User ID',
    })
    .describe('User ID'),
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
});

export type UpdateNameValidation = typeof updateNameValidationSchema;
