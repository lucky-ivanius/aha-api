import { getUsersRepositoryMock } from '../../../../__mocks__/repositories/users-repository.mock';
import { getTokenServiceMock } from '../../../../__mocks__/services/token-service.mock';
import { Email } from '../../../../domain/models/user/email';
import { Name } from '../../../../domain/models/user/name';
import { Password } from '../../../../domain/models/user/password';
import { User } from '../../../../domain/models/user/user';
import { NotFoundError } from '../../../common/errors';
import { InvalidVerifyTokenError } from '../../../errors/users/invalid-verify-token.error';
import { VerifyEmailPayload } from '../../../services/token.service';
import {
  VerifyEmailRequest,
  VerifyEmailUseCase,
} from '../verify-email.use-case';

describe('use-cases:users - Verify Email (Use Case)', () => {
  let user: User;
  let userWithVerifiedEmail: User;
  let verifyPayload: VerifyEmailPayload;

  beforeEach(() => {
    const now = new Date();
    user = User.create({
      name: Name.create('name').data,
      email: Email.create('valid@email.com').data,
      isEmailVerified: false,
      password: Password.create('hashed', true).data,
      loginCount: 0,
      createdAt: now,
    }).data;
    userWithVerifiedEmail = User.create({
      name: Name.create('name').data,
      email: Email.create('valid@email.com').data,
      isEmailVerified: true,
      password: Password.create('hashed', true).data,
      loginCount: 0,
      createdAt: now,
    }).data;
    verifyPayload = {
      email: user.email.value,
      sub: user.id.toString(),
      type: 'verify_email',
    };
  });

  it("should verify user's email successfully", async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findById: jest.fn().mockResolvedValue(user),
    });

    const tokenServiceMock = getTokenServiceMock({
      verify: jest.fn().mockResolvedValue(verifyPayload),
    });

    const verifyEmailUseCase = new VerifyEmailUseCase(
      usersRepositoryMock,
      tokenServiceMock
    );

    const verifyEmailRequest: VerifyEmailRequest = {
      verifyToken: '1234',
    };

    const result = await verifyEmailUseCase.execute(verifyEmailRequest);

    expect(usersRepositoryMock.findById).toHaveBeenCalledTimes(1);
    expect(usersRepositoryMock.save).toHaveBeenCalledTimes(1);

    expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

    expect(result.isSuccess).toBeTruthy();
  });

  it('should fail for invalid token', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findById: jest.fn().mockResolvedValue(user),
    });

    const tokenServiceMock = getTokenServiceMock({
      verify: jest.fn().mockResolvedValue(null),
    });

    const verifyEmailUseCase = new VerifyEmailUseCase(
      usersRepositoryMock,
      tokenServiceMock
    );

    const verifyEmailRequest: VerifyEmailRequest = {
      verifyToken: '1234',
    };

    const result = await verifyEmailUseCase.execute(verifyEmailRequest);

    expect(usersRepositoryMock.findById).not.toHaveBeenCalled();
    expect(usersRepositoryMock.save).not.toHaveBeenCalled();

    expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

    expect(result).toBeInstanceOf(InvalidVerifyTokenError);
    expect(result.isSuccess).toBeFalsy();
  });

  it('should fail for invalid token type', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findById: jest.fn().mockResolvedValue(user),
    });

    const tokenServiceMock = getTokenServiceMock({
      verify: jest.fn().mockResolvedValue({
        ...verifyPayload,
        type: '',
      }),
    });

    const verifyEmailUseCase = new VerifyEmailUseCase(
      usersRepositoryMock,
      tokenServiceMock
    );

    const verifyEmailRequest: VerifyEmailRequest = {
      verifyToken: '1234',
    };

    const result = await verifyEmailUseCase.execute(verifyEmailRequest);

    expect(usersRepositoryMock.findById).not.toHaveBeenCalled();
    expect(usersRepositoryMock.save).not.toHaveBeenCalled();

    expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

    expect(result).toBeInstanceOf(InvalidVerifyTokenError);
    expect(result.isSuccess).toBeFalsy();
  });

  it('should fail if user was not found', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findById: jest.fn().mockResolvedValue(null),
    });

    const tokenServiceMock = getTokenServiceMock({
      verify: jest.fn().mockResolvedValue(verifyPayload),
    });

    const verifyEmailUseCase = new VerifyEmailUseCase(
      usersRepositoryMock,
      tokenServiceMock
    );

    const verifyEmailRequest: VerifyEmailRequest = {
      verifyToken: '1234',
    };

    const result = await verifyEmailUseCase.execute(verifyEmailRequest);

    expect(usersRepositoryMock.findById).toHaveBeenCalledTimes(1);
    expect(usersRepositoryMock.save).not.toHaveBeenCalled();

    expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

    expect(result).toBeInstanceOf(NotFoundError);
    expect(result.isSuccess).toBeFalsy();
  });

  it('should fail if user has been verified', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findById: jest.fn().mockResolvedValue(userWithVerifiedEmail),
    });

    const tokenServiceMock = getTokenServiceMock({
      verify: jest.fn().mockResolvedValue(verifyPayload),
    });

    const verifyEmailUseCase = new VerifyEmailUseCase(
      usersRepositoryMock,
      tokenServiceMock
    );

    const verifyEmailRequest: VerifyEmailRequest = {
      verifyToken: '1234',
    };

    const result = await verifyEmailUseCase.execute(verifyEmailRequest);

    expect(usersRepositoryMock.findById).toHaveBeenCalledTimes(1);
    expect(usersRepositoryMock.save).not.toHaveBeenCalled();

    expect(tokenServiceMock.verify).toHaveBeenCalledTimes(1);

    expect(result).toBeInstanceOf(InvalidVerifyTokenError);
    expect(result.isSuccess).toBeFalsy();
  });
});
