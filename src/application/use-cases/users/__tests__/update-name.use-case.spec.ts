import { getUsersRepositoryMock } from '../../../../__mocks__/repositories/users-repository.mock';
import { Email } from '../../../../domain/models/user/email';
import { IdentityProvider } from '../../../../domain/models/user/identity-provider';
import { Name } from '../../../../domain/models/user/name';
import { Password } from '../../../../domain/models/user/password';
import { User } from '../../../../domain/models/user/user';
import { NotFoundError } from '../../../common/errors';
import { UpdateNameRequest, UpdateNameUseCase } from '../update-name.use-case';

describe('use-cases:users - Update Name (Use Case)', () => {
  let user: User;
  let idProviderUser: User;

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
    idProviderUser = User.create({
      name: Name.create('name').data,
      email: Email.create('valid@email.com').data,
      isEmailVerified: true,
      identityProvider: IdentityProvider.create('google-oauth2', '123456').data,
      loginCount: 0,
      createdAt: now,
    }).data;
  });

  it("should update user's name successfully", async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findById: jest.fn().mockResolvedValue(user),
    });

    const registerWithOAuthUseCase = new UpdateNameUseCase(usersRepositoryMock);

    const registerWithOAuthRequest: UpdateNameRequest = {
      userId: user.id.toString(),
      name: 'new name',
    };

    const result = await registerWithOAuthUseCase.execute(
      registerWithOAuthRequest
    );

    expect(usersRepositoryMock.findById).toHaveBeenCalled();
    expect(usersRepositoryMock.findById).toHaveBeenCalledTimes(1);
    expect(usersRepositoryMock.save).toHaveBeenCalled();
    expect(usersRepositoryMock.save).toHaveBeenCalledTimes(1);

    expect(result.isSuccess).toBeTruthy();
  });

  it("should update external user's name successfully", async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findById: jest.fn().mockResolvedValue(idProviderUser),
    });

    const registerWithOAuthUseCase = new UpdateNameUseCase(usersRepositoryMock);

    const registerWithOAuthRequest: UpdateNameRequest = {
      userId: user.id.toString(),
      name: 'new name',
    };

    const result = await registerWithOAuthUseCase.execute(
      registerWithOAuthRequest
    );

    expect(usersRepositoryMock.findById).toHaveBeenCalled();
    expect(usersRepositoryMock.findById).toHaveBeenCalledTimes(1);
    expect(usersRepositoryMock.save).toHaveBeenCalled();
    expect(usersRepositoryMock.save).toHaveBeenCalledTimes(1);

    expect(result.isSuccess).toBeTruthy();
  });

  it('should fail if user was not found', async () => {
    const usersRepositoryMock = getUsersRepositoryMock({
      findById: jest.fn().mockResolvedValue(null),
    });

    const registerWithOAuthUseCase = new UpdateNameUseCase(usersRepositoryMock);

    const registerWithOAuthRequest: UpdateNameRequest = {
      userId: user.id.toString(),
      name: 'new name',
    };

    const result = await registerWithOAuthUseCase.execute(
      registerWithOAuthRequest
    );

    expect(usersRepositoryMock.findById).toHaveBeenCalled();
    expect(usersRepositoryMock.findById).toHaveBeenCalledTimes(1);

    expect(usersRepositoryMock.save).not.toHaveBeenCalled();

    expect(result).toBeInstanceOf(NotFoundError);
    expect(result.isSuccess).toBeFalsy();
  });
});
