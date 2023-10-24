export interface Payload {
  sub: string;
}

export interface AccessPayload extends Payload {
  type: 'access';
}

export interface VerifyEmailPayload extends Payload {
  email: string;
  type: 'verify_email';
}

export interface ResetPasswordPayload extends Payload {
  type: 'reset_password';
}

export interface TokenService {
  sign(payload: Payload, expiryHours?: number): string;
  verify(token: string): Promise<Payload | null>;
}
