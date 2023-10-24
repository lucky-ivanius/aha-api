import { getUsersRepositoryMock } from '../../../../__mocks__/repositories/users-repository.mock';
import { getHashingServiceMock } from '../../../../__mocks__/services/hashing-service.mock';
import { Id } from '../../../../domain/common/id';
import { Email } from '../../../../domain/models/user/email';
import { Name } from '../../../../domain/models/user/name';
import { Password } from '../../../../domain/models/user/password';
import { User, UserProps } from '../../../../domain/models/user/user';
import { NotFoundError } from '../../../common/errors';
import { ChangePasswordRequestDto } from '../../../dtos/request/users/change-password-request.dto';
import { IncorrectPasswordError } from '../../../errors/users/incorrect-password.error';
import { ChangePasswordUseCase } from '../change-password.use-case';

describe('use-cases:users - Change Password (Use Case)', () => {
  const userProps: UserProps = {
    name: Name.create('name').data,
    email: Email.create('valid@email.com').data,
    isEmailVerified: true,
    loginCount: 0,
    createdAt: new Date(),
  };

  let userId: Id;
  let user: User;
  let userWithNoPassword: User;

  beforeEach(() => {
    userId = new Id();
    user = User.create({
      ...userProps,
      password: Password.create('hashed-password', true).data,
    }).data;
    userWithNoPassword = User.create(userProps).data;
  });

  it('should change password successfully for valid input', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findById: jest.fn().mockResolvedValue(user),
    });

    const hashingServiceMock = getHashingServiceMock({
      hash: jest.fn().mockResolvedValue(Password.create('password', true).data),
      compare: jest.fn().mockResolvedValue(true),
    });

    const changePasswordUseCase = new ChangePasswordUseCase(
      usersRepositoryMock,
      hashingServiceMock
    );

    const changePasswordDto: ChangePasswordRequestDto = {
      userId: userId.toString(),
      currentPassword: 'CurrP@ssw0rd',
      newPassword: 'Str0ngP@ssword',
    };

    const result = await changePasswordUseCase.execute(changePasswordDto);

    expect(usersRepositoryMock.findById).toHaveBeenCalledTimes(1);
    expect(usersRepositoryMock.save).toHaveBeenCalledTimes(1);

    expect(hashingServiceMock.compare).toHaveBeenCalledTimes(1);
    expect(hashingServiceMock.hash).toHaveBeenCalledTimes(1);

    expect(result.isSuccess).toBeTruthy();
  });

  it('should fail if user was not found', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findById: jest.fn().mockResolvedValue(null),
    });

    const hashingServiceMock = getHashingServiceMock();

    const changePasswordUseCase = new ChangePasswordUseCase(
      usersRepositoryMock,
      hashingServiceMock
    );

    const changePasswordDto: ChangePasswordRequestDto = {
      userId: userId.toString(),
      currentPassword: 'W3akP@ssword',
      newPassword: 'Str0ngP@ssword',
    };

    const result = await changePasswordUseCase.execute(changePasswordDto);

    expect(usersRepositoryMock.findById).toHaveBeenCalledTimes(1);
    expect(usersRepositoryMock.save).not.toHaveBeenCalled();

    expect(hashingServiceMock.compare).not.toHaveBeenCalled();
    expect(hashingServiceMock.hash).not.toHaveBeenCalled();

    expect(result).toBeInstanceOf(NotFoundError);
    expect(result.isSuccess).toBeFalsy();
  });

  it('should fail if user has no password authentication', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findById: jest.fn().mockResolvedValue(userWithNoPassword),
    });

    const hashingServiceMock = getHashingServiceMock();

    const changePasswordUseCase = new ChangePasswordUseCase(
      usersRepositoryMock,
      hashingServiceMock
    );

    const changePasswordDto: ChangePasswordRequestDto = {
      userId: userId.toString(),
      currentPassword: 'W3akP@ssword',
      newPassword: 'Str0ngP@ssword',
    };

    const result = await changePasswordUseCase.execute(changePasswordDto);

    expect(usersRepositoryMock.findById).toHaveBeenCalledTimes(1);
    expect(usersRepositoryMock.save).not.toHaveBeenCalled();

    expect(hashingServiceMock.compare).not.toHaveBeenCalled();
    expect(hashingServiceMock.hash).not.toHaveBeenCalled();

    expect(result).toBeInstanceOf(IncorrectPasswordError);
    expect(result.isSuccess).toBeFalsy();
  });

  it('should fail for incorrect password', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findById: jest.fn().mockResolvedValue(user),
    });

    const hashingServiceMock = getHashingServiceMock({
      compare: jest.fn().mockResolvedValue(false),
    });

    const changePasswordUseCase = new ChangePasswordUseCase(
      usersRepositoryMock,
      hashingServiceMock
    );

    const changePasswordDto: ChangePasswordRequestDto = {
      userId: userId.toString(),
      currentPassword: 'W3akP@ssword',
      newPassword: 'Str0ngP@ssword',
    };

    const result = await changePasswordUseCase.execute(changePasswordDto);

    expect(usersRepositoryMock.findById).toHaveBeenCalledTimes(1);
    expect(usersRepositoryMock.save).not.toHaveBeenCalled();

    expect(hashingServiceMock.compare).toHaveBeenCalledTimes(1);
    expect(hashingServiceMock.hash).not.toHaveBeenCalled();

    expect(result).toBeInstanceOf(IncorrectPasswordError);
    expect(result.isSuccess).toBeFalsy();
  });
});
