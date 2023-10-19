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
    createdAt: now,
  };

  let userWithPassword: UserProps;
  let userWithIdentityProvider: UserProps;

  let user: User;

  beforeEach(() => {
    userWithPassword = {
      ...userProps,
      password: Password.create('this-is-hashed-password', true).data,
    };

    userWithIdentityProvider = {
      ...userProps,
      identityProvider: IdentityProvider.create('google', '12345').data,
    };

    user = User.create(userProps).data;
  });

  describe('create', () => {
    it('should pass for a valid user with password', () => {
      const result = User.create(userWithPassword);

      expect(result.isSuccess).toBeTruthy();
      expect(result.data).toBeInstanceOf(User);
      expect(result.data.name).toEqual(userWithPassword.name);
      expect(result.data.email).toEqual(userWithPassword.email);
      expect(result.data.isEmailVerified).toEqual(
        userWithPassword.isEmailVerified
      );
      expect(result.data.password).toEqual(userWithPassword.password);
      expect(result.data.identityProvider).toBeUndefined();
    });

    it('should pass for a valid user with identity provider', () => {
      const result = User.create(userWithIdentityProvider);

      expect(result.isSuccess).toBeTruthy();
      expect(result.data).toBeInstanceOf(User);
      expect(result.data.name).toEqual(userWithIdentityProvider.name);
      expect(result.data.email).toEqual(userWithIdentityProvider.email);
      expect(result.data.isEmailVerified).toEqual(
        userWithIdentityProvider.isEmailVerified
      );
      expect(result.data.password).toBeUndefined();
      expect(result.data.identityProvider).toEqual(
        userWithIdentityProvider.identityProvider
      );
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
