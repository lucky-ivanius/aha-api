import { JwtPayload, sign, verify } from 'jsonwebtoken';
import {
  Payload,
  TokenService,
} from '../../application/services/token.service';

export class JwtService implements TokenService {
  constructor(
    private readonly secretKey: string,
    private readonly defaultExpiryHours: number = 24
  ) {}

  sign(payload: Payload, expiryHours?: number): string {
    return sign(payload, this.secretKey, {
      expiresIn: `${expiryHours ?? this.defaultExpiryHours}h`,
    });
  }

  async verify(token: string): Promise<Payload | null> {
    try {
      const result = verify(token, this.secretKey) as JwtPayload;

      if (!result) return null;

      return result as Payload;
    } catch (error) {
      return null;
    }
  }
}
