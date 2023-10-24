import { AuthMiddleware } from '../../http/middlewares/auth.middleware';
import { usersRepository } from '../repositories/users.repository';
import { auth0JwtService } from '../services/auth0-jwt.service';
import { jwtService } from '../services/jwt.service';

export const authMiddleware = new AuthMiddleware(
  usersRepository,
  jwtService,
  auth0JwtService
);
