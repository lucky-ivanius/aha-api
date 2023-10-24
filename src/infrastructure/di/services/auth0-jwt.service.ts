import { auth0Config } from '../../config/auth0.config';
import { Auth0JwtService } from '../../services/auth0-jwt.service';

export const auth0JwtService = new Auth0JwtService(auth0Config.jwksUri);
