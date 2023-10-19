import { Guard } from '../../common/guard';
import { Id } from '../../common/id';
import { Model } from '../../common/model';
import { Result } from '../../common/result';

export interface SessionProps {
  userId: Id;
  token: string;
  expiryDate: Date;
  isActive?: boolean;
}

export class Session implements Model<SessionProps> {
  get userId() {
    return this.props.userId;
  }

  get token() {
    return this.props.token;
  }

  get expiryDate() {
    return this.props.expiryDate;
  }

  get isActive() {
    const now = new Date();
    return this.expiryDate >= now;
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
    const expiryDateGuard = Guard.required({
      name: 'Expired date',
      value: props.expiryDate,
    });

    const propsResult = Result.combine(
      userIdGuard,
      tokenGuard,
      expiryDateGuard
    );
    if (!propsResult.isSuccess) return Result.fail(propsResult.error);

    return Result.ok(new Session(props, id ?? new Id()));
  }
}
