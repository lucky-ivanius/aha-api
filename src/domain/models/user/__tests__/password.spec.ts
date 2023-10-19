import { Password } from '../password';

describe('models:user - Password (Value Object)', () => {
  it('should pass for a valid password', () => {
    const password = 'Str0ngP@ssword';
    const isHashed = false;

    const result = Password.create(password, isHashed);

    expect(result.isSuccess).toBeTruthy();
    expect(result.data).toBeInstanceOf(Password);
    expect(result.data.value).toBe(password);
    expect(result.data.isHashed).toBe(isHashed);
  });

  it('should pass for a valid hashed password', () => {
    const password = 'this-is-hashed-password';
    const isHashed = true;

    const result = Password.create(password, isHashed);

    expect(result.isSuccess).toBeTruthy();
    expect(result.data).toBeInstanceOf(Password);
    expect(result.data.value).toBe(password);
    expect(result.data.isHashed).toBe(isHashed);
  });

  it('should fail for an empty password', () => {
    const password = null;

    const result = Password.create(password!);

    expect(result.isSuccess).toBeFalsy();
    expect(result.error).toBeDefined();
  });

  it('should fail for an invalid password', () => {
    const password = 'invalid';

    const result = Password.create(password);

    expect(result.isSuccess).toBeFalsy();
    expect(result.error).toBeDefined();
  });
});
