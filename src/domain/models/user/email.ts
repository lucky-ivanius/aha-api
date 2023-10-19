import { Guard } from '../../common/guard';
import { Result } from '../../common/result';

export type EmailProps = {
  value: string;
};

export class Email implements EmailProps {
  private static readonly emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  get value() {
    return this.props.value;
  }

  private constructor(private readonly props: EmailProps) {}

  public static create(value: string): Result<Email> {
    const valueRequiredGuard = Guard.required({
      name: Email.name,
      value,
    });
    if (!valueRequiredGuard.isSuccess)
      return Result.fail(valueRequiredGuard.error);

    const valueRegexGuard = Guard.regex({
      name: Email.name,
      regex: this.emailRegex,
      value,
    });
    if (!valueRegexGuard.isSuccess) return Result.fail(valueRegexGuard.error);

    return Result.ok(new Email({ value: value.toLowerCase() }));
  }
}
