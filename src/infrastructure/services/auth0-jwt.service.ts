import { decode, verify } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import {
  Payload,
  TokenService,
} from '../../application/services/token.service';

export class Auth0JwtService implements TokenService {
  private readonly jwkClient: JwksClient;

  constructor(readonly jwksUri: string) {
    this.jwkClient = new JwksClient({
      jwksUri,
    });
  }

  private async getPublicKey(kid?: string): Promise<string> {
    const signingKey = await this.jwkClient.getSigningKey(kid);

    return signingKey.getPublicKey();
  }

  private getKidFromToken(token: string) {
    const decoded = decode(token, { complete: true });

    return decoded?.header.kid;
  }

  sign(payload: Payload, expiryHours?: number): string {
    console.error(payload, expiryHours);
    return '';
  }

  async verify(token: string): Promise<Payload | null> {
    try {
      const kid = this.getKidFromToken(token);

      const publicKey = await this.getPublicKey(kid);

      const result = verify(token, publicKey);

      if (!result) return null;

      return result as Payload;
    } catch (error) {
      return null;
    }
  }
}
