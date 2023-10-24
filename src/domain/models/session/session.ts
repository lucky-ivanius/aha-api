import { Guard } from '../../common/guard';
import { Id } from '../../common/id';
import { Model } from '../../common/model';
import { Result } from '../../common/result';

export interface SessionProps {
  userId: Id;
  token: string;
}

export class Session implements Model<SessionProps> {
  get userId() {
    return this.props.userId;
  }

  get token() {
    return this.props.token;
  }

  private constructor(
    private readonly props: SessionProps,
    public readonly id: Id
  ) {}

  public static create(props: SessionProps, id?: Id): Result<Session> {
    const userIdGuard = Guard.required({
      name: 'User ID',
      value: props.userId,
    });
    const tokenGuard = Guard.required({
      name: 'Token',
      value: props.token,
    });

    const propsResult = Result.combine(userIdGuard, tokenGuard);
    if (!propsResult.isSuccess) return Result.fail(propsResult.error);

    return Result.ok(new Session(props, id ?? new Id()));
  }
}
