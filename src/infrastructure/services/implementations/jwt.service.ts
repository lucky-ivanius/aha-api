import { sign, verify } from 'jsonwebtoken';
import {
  Payload,
  TokenService,
  VerifiedPayload,
} from '../../../domain/services/token.service';
import { jwtConfig } from '../../config/jwt.config';

export class JwtService implements TokenService {
  sign(payload: Payload): string {
    return sign(payload, jwtConfig.secret, {
      expiresIn: `${jwtConfig.expiryHours}h`,
    });
  }

  async verify(token: string): Promise<VerifiedPayload | null> {
    try {
      const result = verify(token, jwtConfig.secret);

      if (!result) return null;

      return result as VerifiedPayload;
    } catch (error) {
      return null;
    }
  }
}
