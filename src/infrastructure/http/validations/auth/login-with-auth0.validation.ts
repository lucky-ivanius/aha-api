import { z } from 'zod';

export const loginWithAuth0ValidationSchema = z.object({
  accessToken: z
    .string({
      required_error: 'Access token is required',
      invalid_type_error: 'Invalid access token',
    })
    .describe('Access token'),
});

export type LoginWithAuth0Validation = typeof loginWithAuth0ValidationSchema;
