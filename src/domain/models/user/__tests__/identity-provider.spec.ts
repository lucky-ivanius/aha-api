import { IdentityProvider } from '../identity-provider';

describe('models:user - Identity Provider (Value Object)', () => {
  it('should pass for a valid identity provider', () => {
    const provider = 'google-oauth2';
    const identifier = '1234567890';
    const allowChangePassword = false;

    const result = IdentityProvider.create(
      provider,
      identifier,
      allowChangePassword
    );

    expect(result.isSuccess).toBeTruthy();
    expect(result.data).toBeInstanceOf(IdentityProvider);
    expect(result.data.provider).toBe(provider);
    expect(result.data.identifier).toBe(identifier);
    expect(result.data.allowChangePassword).toBe(allowChangePassword);
  });

  it('should fail for an empty provider', () => {
    const identifier = '1234567890';

    const result = IdentityProvider.create(undefined!, identifier);

    expect(result.isSuccess).toBeFalsy();
    expect(result.error).toBeDefined();
  });

  it('should fail for an empty identifier', () => {
    const provider = 'google-oauth2';

    const result = IdentityProvider.create(provider, undefined!);

    expect(result.isSuccess).toBeFalsy();
    expect(result.error).toBeDefined();
  });
});
