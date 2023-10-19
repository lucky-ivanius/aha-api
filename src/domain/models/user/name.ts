import { Guard } from '../../common/guard';
import { Result } from '../../common/result';

export type NameProps = {
  value: string;
};

export class Name implements NameProps {
  get value() {
    return this.props.value;
  }

  private constructor(private readonly props: NameProps) {}

  public static create(value: string): Result<Name> {
    const nameRequiredGuard = Guard.required({
      name: Name.name,
      value,
    });
    if (!nameRequiredGuard.isSuccess)
      return Result.fail(nameRequiredGuard.error);

    const nameLengthNumberGuard = Guard.number({
      name: Name.name,
      value: value.length,
      operator: 'gte',
      compareTo: 2,
      message: `${Name.name} must be contain at least 2 characters`,
    });
    if (!nameLengthNumberGuard.isSuccess)
      return Result.fail(nameLengthNumberGuard.error);

    return Result.ok(new Name({ value }));
  }
}
