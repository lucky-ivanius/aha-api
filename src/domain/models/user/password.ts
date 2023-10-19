import { Guard } from '../../common/guard';
import { Result } from '../../common/result';

export interface PasswordProps {
  value: string;
  isHashed: boolean;
}

export class Password implements PasswordProps {
  private static readonly passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).{8,}$/;

  private static readonly passwordPatternDescription =
    'Password must contains at least 8 characters, one lower character, one upper character, one digit character, one special character';

  get value() {
    return this.props.value;
  }

  get isHashed() {
    return this.props.isHashed;
  }

  private constructor(private readonly props: PasswordProps) {}

  public static create(value: string, isHashed?: boolean): Result<Password> {
    const valueRequiredGuard = Guard.required({ name: Password.name, value });
    if (!valueRequiredGuard.isSuccess)
      return Result.fail(valueRequiredGuard.error);

    if (!isHashed) {
      const valueRegexGuard = Guard.regex({
        name: Password.name,
        value,
        regex: this.passwordPattern,
        message: this.passwordPatternDescription,
      });

      if (!valueRegexGuard.isSuccess) return Result.fail(valueRegexGuard.error);
    }

    return Result.ok(new Password({ value, isHashed: isHashed ?? false }));
  }
}
