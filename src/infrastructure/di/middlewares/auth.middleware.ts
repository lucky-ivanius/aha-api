import { AuthMiddleware } from '../../http/middlewares/auth.middleware';
import { sessionsRepository } from '../repositories/sessions.repository';
import { auth0JwtService } from '../services/auth0-jwt.service';
import { jwtService } from '../services/jwt.service';

export const authMiddleware = new AuthMiddleware(
  sessionsRepository,
  jwtService,
  auth0JwtService
);
