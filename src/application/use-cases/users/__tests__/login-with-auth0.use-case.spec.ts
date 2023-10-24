import { getSessionsRepositoryMock } from '../../../../__mocks__/repositories/sessions-repository.mock';
import { getUsersRepositoryMock } from '../../../../__mocks__/repositories/users-repository.mock';
import { getExternalAuthServiceMock } from '../../../../__mocks__/services/external-auth-service.mock';
import { Email } from '../../../../domain/models/user/email';
import { IdentityProvider } from '../../../../domain/models/user/identity-provider';
import { Name } from '../../../../domain/models/user/name';
import { User } from '../../../../domain/models/user/user';
import { InvalidAccessTokenError } from '../../../errors/users/invalid-access-token.error';
import {
  LoginWithAuth0Request,
  LoginWithAuth0UseCase,
} from '../login-with-auth0.use-case';

describe('use-cases:users - Login With Auth0 (Use Case)', () => {
  let user: User;

  beforeEach(() => {
    user = User.create({
      name: Name.create('name').data,
      email: Email.create('valid@email.com').data,
      isEmailVerified: true,
      provider: IdentityProvider.create('auth0', '2134').data,
      loginCount: 0,
      createdAt: new Date(),
    }).data;
  });

  it('should login successfully', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findByEmail: jest.fn().mockResolvedValue(user),
    });

    const sessionsRepositoryMock = getSessionsRepositoryMock();

    const identityProviderService = getExternalAuthServiceMock({
      getUserByToken: jest.fn().mockResolvedValue(user),
    });

    const loginUseCase = new LoginWithAuth0UseCase(
      usersRepositoryMock,
      sessionsRepositoryMock,
      identityProviderService
    );

    const loginRequest: LoginWithAuth0Request = {
      accessToken: '1234',
    };

    const result = await loginUseCase.execute(loginRequest);

    expect(usersRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);
    expect(usersRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(sessionsRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(identityProviderService.getUserByToken).toHaveBeenCalledTimes(1);

    expect(result.isSuccess).toBeTruthy();
  });

  it('should login successfully if user is not in database', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findByEmail: jest.fn().mockResolvedValue(null),
    });

    const sessionsRepositoryMock = getSessionsRepositoryMock();

    const identityProviderService = getExternalAuthServiceMock({
      getUserByToken: jest.fn().mockResolvedValue(user),
    });

    const loginUseCase = new LoginWithAuth0UseCase(
      usersRepositoryMock,
      sessionsRepositoryMock,
      identityProviderService
    );

    const loginRequest: LoginWithAuth0Request = {
      accessToken: '1234',
    };

    const result = await loginUseCase.execute(loginRequest);

    expect(usersRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);
    expect(usersRepositoryMock.save).toHaveBeenCalledTimes(2);
    expect(sessionsRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(identityProviderService.getUserByToken).toHaveBeenCalledTimes(1);

    expect(result.isSuccess).toBeTruthy();
  });

  it('should fail for invalid access token', async () => {
    const usersRepositoryMock = getUsersRepositoryMock();

    const sessionsRepositoryMock = getSessionsRepositoryMock();

    const identityProviderService = getExternalAuthServiceMock({
      getUserByToken: jest.fn().mockResolvedValue(null),
    });

    const loginUseCase = new LoginWithAuth0UseCase(
      usersRepositoryMock,
      sessionsRepositoryMock,
      identityProviderService
    );

    const loginRequest: LoginWithAuth0Request = {
      accessToken: '1234',
    };

    const result = await loginUseCase.execute(loginRequest);

    expect(usersRepositoryMock.findByEmail).not.toHaveBeenCalled();
    expect(usersRepositoryMock.save).not.toHaveBeenCalled();
    expect(sessionsRepositoryMock.save).not.toHaveBeenCalled();
    expect(identityProviderService.getUserByToken).toHaveBeenCalledTimes(1);

    expect(result).toBeInstanceOf(InvalidAccessTokenError);
    expect(result.isSuccess).toBeFalsy();
  });
});
