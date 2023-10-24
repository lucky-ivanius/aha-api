import { jwtConfig } from '../../config/jwt.config';
import { JwtService } from '../../services/jwt.service';

export const jwtService = new JwtService(
  jwtConfig.secret,
  jwtConfig.expiryHours
);
