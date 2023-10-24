import { Id } from '../../../domain/common/id';
import { Result } from '../../../domain/common/result';
import { Password } from '../../../domain/models/user/password';
import { User } from '../../../domain/models/user/user';
import { UsersRepository } from '../../../domain/repositories/users.repository';
import { NotFoundError, UnexpectedError } from '../../common/errors';
import { UseCase } from '../../common/use-case';
import { ChangePasswordRequestDto } from '../../dtos/request/users/change-password-request.dto';
import { IncorrectPasswordError } from '../../errors/users/incorrect-password.error';
import { HashingService } from '../../services/hashing.service';

export type ChangePasswordRequest = ChangePasswordRequestDto;

export type ChangePasswordResponse =
  | UnexpectedError
  | NotFoundError
  | IncorrectPasswordError
  | Result<void>;

export class ChangePasswordUseCase
  implements UseCase<ChangePasswordRequest, ChangePasswordResponse>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashingService: HashingService
  ) {}

  async execute(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    const newPasswordResult = Password.create(data.newPassword, false);

    const dtoResult = Result.combine(newPasswordResult);
    if (!dtoResult.isSuccess) return Result.fail(dtoResult.error);

    try {
      const user = await this.usersRepository.findById(new Id(data.userId));

      if (!user) return new NotFoundError(User.name, data.userId.toString());

      if (!user.password) return new IncorrectPasswordError();

      const isPasswordMatch = await this.hashingService.compare(
        user.password,
        data.currentPassword
      );

      if (!isPasswordMatch) return new IncorrectPasswordError();

      const hashedPassword = await this.hashingService.hash(
        newPasswordResult.data
      );

      user.changePassword(hashedPassword);

      await this.usersRepository.save(user);

      return Result.ok();
    } catch (err) {
      console.log(err);
      return new UnexpectedError(err);
    }
  }
}
