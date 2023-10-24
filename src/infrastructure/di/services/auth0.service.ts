import { auth0Config } from '../../config/auth0.config';
import { Auth0Service } from '../../services/auth0.service';
import { jwtService } from './jwt.service';

export const auth0Service = new Auth0Service(
  auth0Config.domain,
  auth0Config.clientId,
  auth0Config.clientSecret,
  jwtService
);
