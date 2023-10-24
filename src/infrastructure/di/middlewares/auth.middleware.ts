import { AuthMiddleware } from '../../http/middlewares/auth.middleware';
import { usersRepository } from '../repositories/users.repository';
import { auth0JwtService } from '../services/auth0-jwt.service';
import { auth0Service } from '../services/auth0.service';
import { jwtService } from '../services/jwt.service';

export const authMiddleware = new AuthMiddleware(
  usersRepository,
  auth0Service,
  jwtService,
  auth0JwtService
);
