import { getSessionsRepositoryMock } from '../../../../__mocks__/repositories/sessions-repository.mock';
import { getUsersRepositoryMock } from '../../../../__mocks__/repositories/users-repository.mock';
import { getIdentityProviderServiceMock } from '../../../../__mocks__/services/identity-provider-service.mock';
import { Email } from '../../../../domain/models/user/email';
import { IdentityProvider } from '../../../../domain/models/user/identity-provider';
import { Name } from '../../../../domain/models/user/name';
import { Password } from '../../../../domain/models/user/password';
import { User } from '../../../../domain/models/user/user';
import { InvalidAccessTokenError } from '../../../errors/users/invalid-access-token.error';
import { InvalidCredentialError } from '../../../errors/users/invalid-credential.error';
import { UserRegisteredWithEmailError } from '../../../errors/users/user-registered-with-email.error';
import {
  LoginWithIdProviderRequest,
  LoginWithIdProviderUseCase,
} from '../login-with-id-provider.use-case';

describe('use-cases:users - Login With Identity Provider (Use Case)', () => {
  let user: User;
  let userWithPassword: User;

  beforeEach(() => {
    const now = new Date();
    user = User.create({
      name: Name.create('name').data,
      email: Email.create('valid@email.com').data,
      isEmailVerified: true,
      identityProvider: IdentityProvider.create('auth0', '2134').data,
      loginCount: 0,
      createdAt: now,
    }).data;
    userWithPassword = User.create({
      name: Name.create('name').data,
      email: Email.create('valid@email.com').data,
      isEmailVerified: true,
      password: Password.create('hashed', true).data,
      loginCount: 0,
      createdAt: now,
    }).data;
  });

  it('should login successfully', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findByEmail: jest.fn().mockResolvedValue(user),
    });

    const sessionsRepositoryMock = getSessionsRepositoryMock();

    const identityProviderService = getIdentityProviderServiceMock({
      getUserInfo: jest.fn().mockResolvedValue(user),
    });

    const loginUseCase = new LoginWithIdProviderUseCase(
      usersRepositoryMock,
      sessionsRepositoryMock,
      identityProviderService
    );

    const loginRequest: LoginWithIdProviderRequest = {
      accessToken: '1234',
    };

    const result = await loginUseCase.execute(loginRequest);

    expect(usersRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);
    expect(usersRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(sessionsRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(identityProviderService.getUserInfo).toHaveBeenCalledTimes(1);

    expect(result.isSuccess).toBeTruthy();
  });

  it('should fail for invalid access token', async () => {
    const usersRepositoryMock = getUsersRepositoryMock();

    const sessionsRepositoryMock = getSessionsRepositoryMock();

    const identityProviderService = getIdentityProviderServiceMock({
      getUserInfo: jest.fn().mockResolvedValue(null),
    });

    const loginUseCase = new LoginWithIdProviderUseCase(
      usersRepositoryMock,
      sessionsRepositoryMock,
      identityProviderService
    );

    const loginRequest: LoginWithIdProviderRequest = {
      accessToken: '1234',
    };

    const result = await loginUseCase.execute(loginRequest);

    expect(usersRepositoryMock.findByEmail).not.toHaveBeenCalled();
    expect(usersRepositoryMock.save).not.toHaveBeenCalled();
    expect(sessionsRepositoryMock.save).not.toHaveBeenCalled();
    expect(identityProviderService.getUserInfo).toHaveBeenCalledTimes(1);

    expect(result).toBeInstanceOf(InvalidAccessTokenError);
    expect(result.isSuccess).toBeFalsy();
  });

  it('should fail if user is not registered', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findByEmail: jest.fn().mockResolvedValue(null),
    });

    const sessionsRepositoryMock = getSessionsRepositoryMock();

    const identityProviderService = getIdentityProviderServiceMock({
      getUserInfo: jest.fn().mockResolvedValue(user),
    });

    const loginUseCase = new LoginWithIdProviderUseCase(
      usersRepositoryMock,
      sessionsRepositoryMock,
      identityProviderService
    );

    const loginRequest: LoginWithIdProviderRequest = {
      accessToken: '1234',
    };

    const result = await loginUseCase.execute(loginRequest);

    expect(usersRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);
    expect(usersRepositoryMock.save).not.toHaveBeenCalled();
    expect(sessionsRepositoryMock.save).not.toHaveBeenCalled();
    expect(identityProviderService.getUserInfo).toHaveBeenCalledTimes(1);

    expect(result).toBeInstanceOf(InvalidCredentialError);
    expect(result.isSuccess).toBeFalsy();
  });

  it('should fail for user registered under email-password auth', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findByEmail: jest.fn().mockResolvedValue(userWithPassword),
    });

    const sessionsRepositoryMock = getSessionsRepositoryMock();

    const identityProviderService = getIdentityProviderServiceMock({
      getUserInfo: jest.fn().mockResolvedValue(user),
    });

    const loginUseCase = new LoginWithIdProviderUseCase(
      usersRepositoryMock,
      sessionsRepositoryMock,
      identityProviderService
    );

    const loginRequest: LoginWithIdProviderRequest = {
      accessToken: '1234',
    };

    const result = await loginUseCase.execute(loginRequest);

    expect(usersRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);
    expect(usersRepositoryMock.save).not.toHaveBeenCalled();
    expect(sessionsRepositoryMock.save).not.toHaveBeenCalled();
    expect(identityProviderService.getUserInfo).toHaveBeenCalledTimes(1);

    expect(result).toBeInstanceOf(UserRegisteredWithEmailError);
    expect(result.isSuccess).toBeFalsy();
  });
});
