import { Id } from '../../../domain/common/id';
import { Result } from '../../../domain/common/result';
import { Name } from '../../../domain/models/user/name';
import { User } from '../../../domain/models/user/user';
import { UsersRepository } from '../../../domain/repositories/users.repository';
import { NotFoundError, UnexpectedError } from '../../common/errors';
import { UseCase } from '../../common/use-case';
import { UpdateNameRequestDto } from '../../dtos/request/users/update-name-request.dto';

export type UpdateNameRequest = UpdateNameRequestDto;

export type UpdateNameResponse = UnexpectedError | NotFoundError | Result<void>;

export class UpdateNameUseCase
  implements UseCase<UpdateNameRequest, UpdateNameResponse>
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(data: UpdateNameRequest): Promise<UpdateNameResponse> {
    const nameResult = Name.create(data.name);

    const dtoResult = Result.combine(nameResult);

    if (!dtoResult.isSuccess) return Result.fail(dtoResult.error);

    try {
      const user = await this.usersRepository.findById(new Id(data.userId));

      if (!user) return new NotFoundError(User.name, data.userId.toString());

      user.updateName(nameResult.data);

      await this.usersRepository.save(user);

      return Result.ok();
    } catch (err) {
      return new UnexpectedError(err);
    }
  }
}
