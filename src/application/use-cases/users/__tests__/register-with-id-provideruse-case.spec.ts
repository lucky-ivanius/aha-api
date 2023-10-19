import { getUsersRepositoryMock } from '../../../../__mocks__/repositories/users-repository.mock';
import { getIdentityProviderServiceMock } from '../../../../__mocks__/services/identity-provider-service.mock';
import { Email } from '../../../../domain/models/user/email';
import { IdentityProvider } from '../../../../domain/models/user/identity-provider';
import { Name } from '../../../../domain/models/user/name';
import { User } from '../../../../domain/models/user/user';
import { EmailAlreadyExistsError } from '../../../errors/users/email-already-exists.error';
import { InvalidAccessTokenError } from '../../../errors/users/invalid-access-token.error';
import {
  RegisterWithIdProviderRequest,
  RegisterWithIdProviderUseCase,
} from '../register-with-id-provider.use-case';

describe('use-cases:users - Register With Identity Provider (Use Case)', () => {
  let user: User;

  beforeEach(() => {
    const now = new Date();
    user = User.create({
      name: Name.create('name').data,
      email: Email.create('valid@email.com').data,
      isEmailVerified: true,
      identityProvider: IdentityProvider.create('auth0', '1234').data,
      loginCount: 0,
      createdAt: now,
    }).data;
  });

  it('should register user successfully', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findByEmail: jest.fn().mockResolvedValue(null),
    });

    const externalAuthServiceMock = getIdentityProviderServiceMock({
      getUserInfo: jest.fn().mockResolvedValue(user),
    });

    const registerWithIdProviderUseCase = new RegisterWithIdProviderUseCase(
      usersRepositoryMock,
      externalAuthServiceMock
    );

    const registerWithIdProviderRequest: RegisterWithIdProviderRequest = {
      accessToken: '1234',
    };

    const result = await registerWithIdProviderUseCase.execute(
      registerWithIdProviderRequest
    );

    expect(externalAuthServiceMock.getUserInfo).toHaveBeenCalled();
    expect(externalAuthServiceMock.getUserInfo).toHaveBeenCalledTimes(1);

    expect(usersRepositoryMock.findByEmail).toHaveBeenCalled();
    expect(usersRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);

    expect(usersRepositoryMock.save).toHaveBeenCalled();
    expect(usersRepositoryMock.save).toHaveBeenCalledTimes(1);

    expect(result.isSuccess).toBeTruthy();
  });

  it('should fail for invalid access token', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findByEmail: jest.fn().mockResolvedValue(user),
    });

    const externalAuthServiceMock = getIdentityProviderServiceMock({
      getUserInfo: jest.fn().mockResolvedValue(null),
    });

    const registerWithIdProviderUseCase = new RegisterWithIdProviderUseCase(
      usersRepositoryMock,
      externalAuthServiceMock
    );

    const registerWithIdProviderRequest: RegisterWithIdProviderRequest = {
      accessToken: '1234',
    };

    const result = await registerWithIdProviderUseCase.execute(
      registerWithIdProviderRequest
    );

    expect(externalAuthServiceMock.getUserInfo).toHaveBeenCalled();
    expect(externalAuthServiceMock.getUserInfo).toHaveBeenCalledTimes(1);

    expect(usersRepositoryMock.findByEmail).not.toHaveBeenCalled();
    expect(usersRepositoryMock.save).not.toHaveBeenCalled();

    expect(result).toBeInstanceOf(InvalidAccessTokenError);
    expect(result.isSuccess).toBeFalsy();
  });

  it('should fail for existing user email', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findByEmail: jest.fn().mockResolvedValue(user),
    });

    const externalAuthServiceMock = getIdentityProviderServiceMock({
      getUserInfo: jest.fn().mockResolvedValue(user),
    });

    const registerWithIdProviderUseCase = new RegisterWithIdProviderUseCase(
      usersRepositoryMock,
      externalAuthServiceMock
    );

    const registerWithIdProviderRequest: RegisterWithIdProviderRequest = {
      accessToken: '1234',
    };

    const result = await registerWithIdProviderUseCase.execute(
      registerWithIdProviderRequest
    );

    expect(externalAuthServiceMock.getUserInfo).toHaveBeenCalled();
    expect(externalAuthServiceMock.getUserInfo).toHaveBeenCalledTimes(1);

    expect(usersRepositoryMock.findByEmail).toHaveBeenCalled();
    expect(usersRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);
    expect(usersRepositoryMock.save).not.toHaveBeenCalled();

    expect(result).toBeInstanceOf(EmailAlreadyExistsError);
    expect(result.isSuccess).toBeFalsy();
  });
});
