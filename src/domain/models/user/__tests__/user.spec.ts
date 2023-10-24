import { Email } from '../email';
import { IdentityProvider } from '../identity-provider';
import { Name } from '../name';
import { Password } from '../password';
import { User, UserProps } from '../user';

describe('models:user - User (Model)', () => {
  const now = new Date();
  const userProps: UserProps = {
    name: Name.create('name').data,
    email: Email.create('valid@email.com').data,
    isEmailVerified: false,
    loginCount: 0,
    password: Password.create('this-is-hashed-password', true).data,
    provider: IdentityProvider.create('google', '12345').data,
    createdAt: now,
  };

  let user: User;

  beforeEach(() => {
    user = User.create(userProps).data;
  });

  describe('create', () => {
    it('should pass for a valid user', () => {
      const result = User.create(user);

      expect(result.isSuccess).toBeTruthy();
      expect(result.data).toBeInstanceOf(User);
      expect(result.data.name).toEqual(user.name);
      expect(result.data.email).toEqual(user.email);
      expect(result.data.isEmailVerified).toEqual(user.isEmailVerified);
      expect(result.data.password).toEqual(user.password);
      expect(result.data.provider).toEqual(user.provider);
    });

    it('should fail for an empty name', () => {
      const props = { ...userProps, name: undefined! };

      const result = User.create(props);

      expect(result.isSuccess).toBeFalsy();
      expect(result.error).toBeDefined();
    });

    it('should fail for an empty email', () => {
      const props = { ...userProps, email: undefined! };

      const result = User.create(props);

      expect(result.isSuccess).toBeFalsy();
      expect(result.error).toBeDefined();
    });
  });

  describe('updateName', () => {
    it('should pass for a valid name', () => {
      const newName = Name.create('name').data;

      user.updateName(newName);

      expect(user.name).toEqual(newName);
    });
  });

  describe('changePassword', () => {
    it('should pass for a valid password', () => {
      const newPassword = Password.create('new-hashed-password', true).data;

      user.changePassword(newPassword);

      expect(user.password).toEqual(newPassword);
    });
  });

  describe('verifyEmail', () => {
    it('should pass to verify email', () => {
      user.verifyEmail();

      expect(user.isEmailVerified).toBeTruthy();
    });
  });

  describe('login', () => {
    const initLoginCount = userProps.loginCount ?? 0;

    it('should pass to login', () => {
      user.login();

      expect(user.loginCount).toEqual(initLoginCount + 1);
    });
  });
});
