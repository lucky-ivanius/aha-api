export interface Payload {
  sub: string;
  email: string;
  isEmailVerified: boolean;
  type: string;
}

export interface AccessPayload extends Payload {
  type: 'access';
}

export interface VerifyEmailPayload extends Payload {
  type: 'verify_email';
}

export interface ResetPasswordPayload extends Payload {
  type: 'reset_password';
}

export interface VerifiedPayload extends Payload {
  iat: number;
  exp: number;
}

export interface TokenService {
  sign(payload: Payload): string;
  verify(token: string): Promise<VerifiedPayload | null>;
}
