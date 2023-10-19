import { Email } from '../email';

describe('models:user - Email (Value Object)', () => {
  it('should pass for a valid email', () => {
    const email = 'Valid@email.com';
    const formattedEmail = 'valid@email.com';

    const result = Email.create(email);

    expect(result.isSuccess).toBeTruthy();
    expect(result.data).toBeInstanceOf(Email);
    expect(result.data.value).toBe(formattedEmail);
  });

  it('should fail for an empty email value', () => {
    const email = null;

    const result = Email.create(email!);

    expect(result.isSuccess).toBeFalsy();
    expect(result.error).toBeDefined();
  });

  it('should fail for an invalid email', () => {
    const email = 'invalid@@@email..com';

    const result = Email.create(email);

    expect(result.isSuccess).toBeFalsy();
    expect(result.error).toBeDefined();
  });
});
