import { Guard } from '../../common/guard';
import { Id } from '../../common/id';
import { Model } from '../../common/model';
import { Result } from '../../common/result';
import { Email } from './email';
import { IdentityProvider } from './identity-provider';
import { Name } from './name';
import { Password } from './password';

export type UserProps = {
  name: Name;
  email: Email;
  isEmailVerified: boolean;
  password?: Password;
  loginCount: number;
  lastLogin?: Date;
  lastSession?: Date;
  provider?: IdentityProvider<unknown>;
  createdAt: Date;
};

export class User implements Model<UserProps> {
  get name() {
    return this.props.name;
  }

  get email() {
    return this.props.email;
  }

  get isEmailVerified() {
    return this.props.isEmailVerified;
  }

  get password() {
    return this.props.password;
  }

  get loginCount() {
    return this.props.loginCount ?? 0;
  }

  get lastLogin() {
    return this.props.lastLogin;
  }

  get lastSession() {
    return this.props.lastSession;
  }

  get provider() {
    return this.props.provider;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  private constructor(
    private props: UserProps,
    public readonly id: Id
  ) {}

  public static create(props: UserProps, id?: Id): Result<User> {
    const nameGuard = Guard.required({ name: Name.name, value: props.name });
    const emailGuard = Guard.required({ name: Email.name, value: props.email });

    const guardResult = Result.combine(nameGuard, emailGuard);
    if (!guardResult.isSuccess) return Result.fail(guardResult.error);

    const user = new User(props, id ?? new Id());

    return Result.ok(user);
  }

  public updateName(name: Name) {
    this.props.name = name;
  }

  public changePassword(password: Password) {
    this.props.password = password;
  }

  public verifyEmail() {
    this.props.isEmailVerified = true;
  }

  public login() {
    if (!this.props.loginCount) this.props.loginCount = 0;
    this.props.loginCount += 1;
    this.props.lastLogin = new Date();
  }
}
