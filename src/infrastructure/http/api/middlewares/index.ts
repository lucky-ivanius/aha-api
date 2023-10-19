import { prismaSessionsRepository } from '../../../database/repositories';
import { auth0Service, jwtService } from '../../../services';
import { AuthMiddleware } from './implementations/auth.middleware';

export const authMiddleware = new AuthMiddleware(
  prismaSessionsRepository,
  jwtService,
  auth0Service
);
