import { getSessionsRepositoryMock } from '../../../../__mocks__/repositories/sessions-repository.mock';
import { getUsersRepositoryMock } from '../../../../__mocks__/repositories/users-repository.mock';
import { getHashingServiceMock } from '../../../../__mocks__/services/hashing-service.mock';
import { getTokenServiceMock } from '../../../../__mocks__/services/token-service.mock';
import { Email } from '../../../../domain/models/user/email';
import { IdentityProvider } from '../../../../domain/models/user/identity-provider';
import { Name } from '../../../../domain/models/user/name';
import { Password } from '../../../../domain/models/user/password';
import { User } from '../../../../domain/models/user/user';
import { AccessPayload } from '../../../../domain/services/token.service';
import { InvalidCredentialError } from '../../../errors/users/invalid-credential.error';
import { UserRegisteredWithIdProviderError } from '../../../errors/users/user-registered-with-id-provider.error';
import { LoginRequest, LoginUseCase } from '../login.use-case';

describe('use-cases:users - Login (Use Case)', () => {
  let user: User;
  let userWithIdProvider: User;

  beforeEach(() => {
    const now = new Date();
    user = User.create({
      name: Name.create('name').data,
      email: Email.create('valid@email.com').data,
      isEmailVerified: true,
      password: Password.create('hashed', true).data,
      loginCount: 0,
      createdAt: now,
    }).data;
    userWithIdProvider = User.create({
      name: Name.create('name').data,
      email: Email.create('valid@email.com').data,
      isEmailVerified: true,
      identityProvider: IdentityProvider.create('auth0', '2134').data,
      loginCount: 0,
      createdAt: now,
    }).data;
  });

  it('should login successfully', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findByEmail: jest.fn().mockResolvedValue(user),
    });

    const sessionsRepositoryMock = getSessionsRepositoryMock();

    const tokenServiceMock = getTokenServiceMock({
      verify: jest.fn().mockResolvedValue({
        sub: user.id.toString(),
        email: user.email.value,
        isEmailVerified: user.isEmailVerified,
        type: 'access',
      } as AccessPayload),
    });

    const hashingServiceMock = getHashingServiceMock({
      compare: jest.fn().mockResolvedValue(true),
    });

    const loginUseCase = new LoginUseCase(
      usersRepositoryMock,
      sessionsRepositoryMock,
      tokenServiceMock,
      hashingServiceMock
    );

    const loginRequest: LoginRequest = {
      email: 'abc@def.com',
      password: 'Str0ngP@ssword',
    };

    const result = await loginUseCase.execute(loginRequest);

    expect(usersRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);
    expect(usersRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(sessionsRepositoryMock.save).toHaveBeenCalledTimes(1);
    expect(hashingServiceMock.compare).toHaveBeenCalledTimes(1);
    expect(tokenServiceMock.sign).toHaveBeenCalledTimes(1);

    expect(result.isSuccess).toBeTruthy();
  });

  it('should fail if user was not found', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findByEmail: jest.fn().mockResolvedValue(null),
    });

    const sessionsRepositoryMock = getSessionsRepositoryMock();

    const tokenServiceMock = getTokenServiceMock();

    const hashingServiceMock = getHashingServiceMock();

    const loginUseCase = new LoginUseCase(
      usersRepositoryMock,
      sessionsRepositoryMock,
      tokenServiceMock,
      hashingServiceMock
    );

    const loginRequest: LoginRequest = {
      email: 'abc@def.com',
      password: 'Str0ngP@ssword',
    };

    const result = await loginUseCase.execute(loginRequest);

    expect(usersRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);
    expect(usersRepositoryMock.save).not.toHaveBeenCalled();
    expect(sessionsRepositoryMock.save).not.toHaveBeenCalled();
    expect(hashingServiceMock.compare).not.toHaveBeenCalled();
    expect(tokenServiceMock.sign).not.toHaveBeenCalled();

    expect(result).toBeInstanceOf(InvalidCredentialError);
    expect(result.isSuccess).toBeFalsy();
  });

  it('should fail for user registered under identity provider', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findByEmail: jest.fn().mockResolvedValue(userWithIdProvider),
    });

    const sessionsRepositoryMock = getSessionsRepositoryMock();

    const tokenServiceMock = getTokenServiceMock();

    const hashingServiceMock = getHashingServiceMock();

    const loginUseCase = new LoginUseCase(
      usersRepositoryMock,
      sessionsRepositoryMock,
      tokenServiceMock,
      hashingServiceMock
    );

    const loginRequest: LoginRequest = {
      email: 'abc@def.com',
      password: 'Str0ngP@ssword',
    };

    const result = await loginUseCase.execute(loginRequest);

    expect(usersRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);
    expect(usersRepositoryMock.save).not.toHaveBeenCalled();
    expect(sessionsRepositoryMock.save).not.toHaveBeenCalled();
    expect(hashingServiceMock.compare).not.toHaveBeenCalled();
    expect(tokenServiceMock.sign).not.toHaveBeenCalled();

    expect(result).toBeInstanceOf(UserRegisteredWithIdProviderError);
    expect(result.isSuccess).toBeFalsy();
  });

  it('should fail if password is wrong', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findByEmail: jest.fn().mockResolvedValue(user),
    });

    const sessionsRepositoryMock = getSessionsRepositoryMock();

    const tokenServiceMock = getTokenServiceMock();

    const hashingServiceMock = getHashingServiceMock({
      compare: jest.fn().mockResolvedValue(false),
    });

    const loginUseCase = new LoginUseCase(
      usersRepositoryMock,
      sessionsRepositoryMock,
      tokenServiceMock,
      hashingServiceMock
    );

    const loginRequest: LoginRequest = {
      email: 'abc@def.com',
      password: 'Str0ngP@ssword',
    };

    const result = await loginUseCase.execute(loginRequest);

    expect(usersRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);
    expect(usersRepositoryMock.save).not.toHaveBeenCalled();
    expect(sessionsRepositoryMock.save).not.toHaveBeenCalled();
    expect(hashingServiceMock.compare).toHaveBeenCalledTimes(1);
    expect(tokenServiceMock.sign).not.toHaveBeenCalled();

    expect(result).toBeInstanceOf(InvalidCredentialError);
    expect(result.isSuccess).toBeFalsy();
  });
});
