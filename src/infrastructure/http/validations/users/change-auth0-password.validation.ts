import { z } from 'zod';

export const changeAuth0PasswordValidationSchema = z
  .object({
    newPassword: z
      .string({
        required_error: 'New password is required',
        invalid_type_error: 'New password must be a string',
      })
      .describe('New Password'),
    confirmPassword: z
      .string({
        required_error: 'Confirmation password is required',
        invalid_type_error: 'Confirmation password must be a string',
      })
      .describe('Confirm Password'),
  })
  .refine(
    ({ newPassword, confirmPassword }) => newPassword === confirmPassword,
    {
      message: "Confirmation password didn't match",
      path: ['confirmPassword'],
    }
  );

export type ChangeAuth0PasswordValidation =
  typeof changeAuth0PasswordValidationSchema;
