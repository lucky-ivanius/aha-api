import { getUsersRepositoryMock } from '../../../../__mocks__/repositories/users-repository.mock';
import { getHashingServiceMock } from '../../../../__mocks__/services/hashing-service.mock';
import { getIdentityProviderServiceMock } from '../../../../__mocks__/services/identity-provider-service.mock';
import { Id } from '../../../../domain/common/id';
import { Email } from '../../../../domain/models/user/email';
import { IdentityProvider } from '../../../../domain/models/user/identity-provider';
import { Name } from '../../../../domain/models/user/name';
import { Password } from '../../../../domain/models/user/password';
import { User, UserProps } from '../../../../domain/models/user/user';
import { AccessDeniedError, NotFoundError } from '../../../common/errors';
import { ChangePasswordRequestDto } from '../../../dtos/request/users/change-password-request.dto';
import { ChangePasswordNotAllowedError } from '../../../errors/users/change-password-not-allowed.error';
import { IncorrectPasswordError } from '../../../errors/users/incorrect-password.error';
import { ChangePasswordUseCase } from '../change-password.use-case';

describe('use-cases:users - Change Password (Use Case)', () => {
  let userId: Id;
  let userWithPassword: User;
  let userWithPasswordIdentityProvider: User;
  let userWithIdentityProvider: User;

  const userProps: UserProps = {
    name: Name.create('name').data,
    email: Email.create('valid@email.com').data,
    isEmailVerified: true,
    loginCount: 0,
    createdAt: new Date(),
  };

  beforeEach(() => {
    userId = new Id();
    userWithPassword = User.create(
      {
        ...userProps,
        password: Password.create('hashed-password', true).data,
      },
      userId
    ).data;
    userWithPasswordIdentityProvider = User.create(
      {
        ...userProps,
        identityProvider: IdentityProvider.create('auth0', '1234', true).data,
      },
      userId
    ).data;
    userWithIdentityProvider = User.create(
      {
        ...userProps,
        identityProvider: IdentityProvider.create('auth0', '1234', false).data,
      },
      userId
    ).data;
  });

  it('should change password successfully for user registered with email', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findById: jest.fn().mockResolvedValue(userWithPassword),
    });

    const hashingServiceMock = getHashingServiceMock({
      hash: jest.fn().mockResolvedValue(Password.create('password', true).data),
      compare: jest.fn().mockResolvedValue(true),
    });

    const identityProviderServiceMock = getIdentityProviderServiceMock();

    const changePasswordUseCase = new ChangePasswordUseCase(
      usersRepositoryMock,
      hashingServiceMock,
      identityProviderServiceMock
    );

    const changePasswordDto: ChangePasswordRequestDto = {
      userId: userId.toString(),
      currentPassword: 'CurrP@ssw0rd',
      newPassword: 'Str0ngP@ssword',
    };

    const result = await changePasswordUseCase.execute(changePasswordDto);

    expect(usersRepositoryMock.findById).toHaveBeenCalled();
    expect(usersRepositoryMock.findById).toHaveBeenCalledTimes(1);

    expect(hashingServiceMock.compare).toHaveBeenCalled();
    expect(hashingServiceMock.compare).toHaveBeenCalledTimes(1);
    expect(hashingServiceMock.hash).toHaveBeenCalled();
    expect(hashingServiceMock.hash).toHaveBeenCalledTimes(1);

    expect(usersRepositoryMock.save).toHaveBeenCalled();
    expect(usersRepositoryMock.save).toHaveBeenCalledTimes(1);

    expect(identityProviderServiceMock.changePassword).not.toHaveBeenCalled();

    expect(result.isSuccess).toBeTruthy();
  });

  it('should change password successfully for user with allow change password for external identifier', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findById: jest.fn().mockResolvedValue(userWithPasswordIdentityProvider),
    });

    const hashingServiceMock = getHashingServiceMock();

    const identityProviderServiceMock = getIdentityProviderServiceMock();

    const changePasswordUseCase = new ChangePasswordUseCase(
      usersRepositoryMock,
      hashingServiceMock,
      identityProviderServiceMock
    );

    const changePasswordDto: ChangePasswordRequestDto = {
      userId: userId.toString(),
      newPassword: 'Str0ngP@ssword',
    };

    const result = await changePasswordUseCase.execute(changePasswordDto);

    expect(usersRepositoryMock.findById).toHaveBeenCalled();
    expect(usersRepositoryMock.findById).toHaveBeenCalledTimes(1);

    expect(identityProviderServiceMock.changePassword).toHaveBeenCalled();
    expect(identityProviderServiceMock.changePassword).toHaveBeenCalledTimes(1);

    expect(hashingServiceMock.compare).not.toHaveBeenCalled();
    expect(hashingServiceMock.hash).not.toHaveBeenCalled();
    expect(usersRepositoryMock.save).not.toHaveBeenCalled();

    expect(result.isSuccess).toBeTruthy();
  });

  it('should fail if user was not found', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findById: jest.fn().mockResolvedValue(null),
    });

    const hashingServiceMock = getHashingServiceMock();

    const identityProviderServiceMock = getIdentityProviderServiceMock();

    const changePasswordUseCase = new ChangePasswordUseCase(
      usersRepositoryMock,
      hashingServiceMock,
      identityProviderServiceMock
    );

    const changePasswordDto: ChangePasswordRequestDto = {
      userId: userId.toString(),
      currentPassword: 'W3akP@ssword',
      newPassword: 'Str0ngP@ssword',
    };

    const result = await changePasswordUseCase.execute(changePasswordDto);

    expect(usersRepositoryMock.findById).toHaveBeenCalled();
    expect(usersRepositoryMock.findById).toHaveBeenCalledTimes(1);

    expect(usersRepositoryMock.save).not.toHaveBeenCalled();
    expect(hashingServiceMock.compare).not.toHaveBeenCalled();
    expect(hashingServiceMock.hash).not.toHaveBeenCalled();

    expect(result).toBeInstanceOf(NotFoundError);
    expect(result.isSuccess).toBeFalsy();
  });

  it('should fail if user has no authentication', async () => {
    const noAuthUser = User.create(userProps, userId).data;

    const usersRepositoryMock = getUsersRepositoryMock({
      findById: jest.fn().mockResolvedValue(noAuthUser),
    });

    const hashingServiceMock = getHashingServiceMock();

    const identityProviderServiceMock = getIdentityProviderServiceMock();

    const changePasswordUseCase = new ChangePasswordUseCase(
      usersRepositoryMock,
      hashingServiceMock,
      identityProviderServiceMock
    );

    const changePasswordDto: ChangePasswordRequestDto = {
      userId: userId.toString(),
      currentPassword: 'W3akP@ssword',
      newPassword: 'Str0ngP@ssword',
    };

    const result = await changePasswordUseCase.execute(changePasswordDto);

    expect(usersRepositoryMock.findById).toHaveBeenCalled();
    expect(usersRepositoryMock.findById).toHaveBeenCalledTimes(1);

    expect(usersRepositoryMock.save).not.toHaveBeenCalled();
    expect(hashingServiceMock.compare).not.toHaveBeenCalled();
    expect(hashingServiceMock.hash).not.toHaveBeenCalled();

    expect(result).toBeInstanceOf(AccessDeniedError);
    expect(result.isSuccess).toBeFalsy();
  });

  it('should fail for incorrect password', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findById: jest.fn().mockResolvedValue(userWithPassword),
    });

    const hashingServiceMock = getHashingServiceMock({
      compare: jest.fn().mockResolvedValue(false),
    });

    const identityProviderServiceMock = getIdentityProviderServiceMock();

    const changePasswordUseCase = new ChangePasswordUseCase(
      usersRepositoryMock,
      hashingServiceMock,
      identityProviderServiceMock
    );

    const changePasswordDto: ChangePasswordRequestDto = {
      userId: userId.toString(),
      currentPassword: 'W3akP@ssword',
      newPassword: 'Str0ngP@ssword',
    };

    const result = await changePasswordUseCase.execute(changePasswordDto);

    expect(usersRepositoryMock.findById).toHaveBeenCalled();
    expect(usersRepositoryMock.findById).toHaveBeenCalledTimes(1);

    expect(hashingServiceMock.compare).toHaveBeenCalled();
    expect(hashingServiceMock.compare).toHaveBeenCalledTimes(1);

    expect(hashingServiceMock.hash).not.toHaveBeenCalled();
    expect(usersRepositoryMock.save).not.toHaveBeenCalled();

    expect(result).toBeInstanceOf(IncorrectPasswordError);
    expect(result.isSuccess).toBeFalsy();
  });

  it('should fail for user with no password changes privileges from external identifier', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findById: jest.fn().mockResolvedValue(userWithIdentityProvider),
    });

    const hashingServiceMock = getHashingServiceMock();

    const identityProviderServiceMock = getIdentityProviderServiceMock();

    const changePasswordUseCase = new ChangePasswordUseCase(
      usersRepositoryMock,
      hashingServiceMock,
      identityProviderServiceMock
    );

    const changePasswordDto: ChangePasswordRequestDto = {
      userId: userId.toString(),
      newPassword: 'Str0ngP@ssword',
    };

    const result = await changePasswordUseCase.execute(changePasswordDto);

    expect(usersRepositoryMock.findById).toHaveBeenCalled();
    expect(usersRepositoryMock.findById).toHaveBeenCalledTimes(1);

    expect(identityProviderServiceMock.changePassword).not.toHaveBeenCalled();
    expect(
      identityProviderServiceMock.changePassword
    ).not.toHaveBeenCalledTimes(1);

    expect(hashingServiceMock.compare).not.toHaveBeenCalled();
    expect(hashingServiceMock.hash).not.toHaveBeenCalled();
    expect(usersRepositoryMock.save).not.toHaveBeenCalled();

    expect(result).toBeInstanceOf(ChangePasswordNotAllowedError);
    expect(result.isSuccess).toBeFalsy();
  });
});
