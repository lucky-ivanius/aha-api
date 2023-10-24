import { getUsersRepositoryMock } from '../../../../__mocks__/repositories/users-repository.mock';
import { getHashingServiceMock } from '../../../../__mocks__/services/hashing-service.mock';
import { getMailServiceMock } from '../../../../__mocks__/services/mail-service.mock';
import { getTokenServiceMock } from '../../../../__mocks__/services/token-service.mock';
import { Email } from '../../../../domain/models/user/email';
import { Name } from '../../../../domain/models/user/name';
import { Password } from '../../../../domain/models/user/password';
import { User } from '../../../../domain/models/user/user';
import { EmailAlreadyExistsError } from '../../../errors/users/email-already-exists.error';
import { RegisterRequest, RegisterUseCase } from '../register.use-case';

describe('use-cases:users - Register (Use Case)', () => {
  let user: User;

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
  });

  it('should register user successfully', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findByEmail: jest.fn().mockResolvedValue(null),
    });

    const hashingServiceMock = getHashingServiceMock();

    const tokenServiceMock = getTokenServiceMock();

    const emailServiceMock = getMailServiceMock();

    const registerUseCase = new RegisterUseCase(
      usersRepositoryMock,
      hashingServiceMock,
      tokenServiceMock,
      emailServiceMock
    );

    const registerRequest: RegisterRequest = {
      name: 'user',
      email: 'abc@def.com',
      password: 'Str0ngP@ssword',
      verifyEndpoint: 'http://localhost/api/v1/verify',
    };

    const result = await registerUseCase.execute(registerRequest);

    expect(usersRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);
    expect(usersRepositoryMock.save).toHaveBeenCalledTimes(1);

    expect(hashingServiceMock.hash).toHaveBeenCalledTimes(1);

    expect(tokenServiceMock.sign).toHaveBeenCalledTimes(1);

    expect(emailServiceMock.sendWithTemplate).toHaveBeenCalledTimes(1);

    expect(result.isSuccess).toBeTruthy();
  });

  it('should fail for existing user email', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findByEmail: jest.fn().mockResolvedValue(user),
    });

    const hashingServiceMock = getHashingServiceMock();

    const tokenServiceMock = getTokenServiceMock();

    const emailServiceMock = getMailServiceMock();

    const registerUseCase = new RegisterUseCase(
      usersRepositoryMock,
      hashingServiceMock,
      tokenServiceMock,
      emailServiceMock
    );

    const registerRequest: RegisterRequest = {
      name: 'user',
      email: 'abc@def.com',
      password: 'Str0ngP@ssword',
      verifyEndpoint: 'http://localhost/api/v1/verify',
    };

    const result = await registerUseCase.execute(registerRequest);

    expect(usersRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);
    expect(usersRepositoryMock.save).not.toHaveBeenCalled();

    expect(hashingServiceMock.hash).not.toHaveBeenCalled();

    expect(tokenServiceMock.sign).not.toHaveBeenCalled();

    expect(emailServiceMock.sendWithTemplate).not.toHaveBeenCalled();

    expect(result).toBeInstanceOf(EmailAlreadyExistsError);
    expect(result.isSuccess).toBeFalsy();
  });
});
