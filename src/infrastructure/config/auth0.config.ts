import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const auth0ConfigSchema = z.object({
  domain: z.string().describe('Auth0 Domain'),
  clientId: z.string().describe('Auth0 Client ID'),
  clientSecret: z.string().describe('Auth0 Client Secret'),
  audience: z.string().describe('Auth0 Audience'),
  jwksUri: z.string().describe('Auth0 JSON Web Key Set URL'),
});

export const auth0Config = auth0ConfigSchema.parse({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  clientSecret: process.env.AUTH0_CLIENT_SECRET,
  audience: process.env.AUTH0_AUDIENCE,
  jwksUri: process.env.AUTH0_JWKS_URI,
});
