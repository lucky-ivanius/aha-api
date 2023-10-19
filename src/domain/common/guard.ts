import { Result } from './result';

export interface GuardArg<T> {
  name: string;
  value: T;
}

export interface RequiredGuard {
  message?: string;
}

export interface RegexGuard {
  regex: RegExp;
  message?: string;
}

export interface NumberGuard {
  operator: 'eq' | 'ne' | 'lt' | 'lte' | 'gt' | 'gte';
  compareTo: number;
  message?: string;
}

export type RequiredGuardArg<T> = GuardArg<T> & RequiredGuard;
export type NumberGuardArg = GuardArg<number> & NumberGuard;
export type RegexGuardArg = GuardArg<string> & RegexGuard;

export class Guard {
  public static required<T>(arg: RequiredGuardArg<T>): Result<T> {
    if (
      arg.value === null ||
      arg.value === undefined ||
      (arg.value.constructor === Object &&
        Object.keys(arg.value ?? {}).length === 0) ||
      (typeof arg.value === 'string' && arg.value.length <= 0)
    )
      return Result.fail(arg.message ?? `${arg.name} is required`);

    return Result.ok(arg.value);
  }

  public static number(arg: NumberGuardArg): Result<number> {
    switch (arg.operator) {
      case 'gt':
        if (arg.value > arg.compareTo) return Result.ok(arg.value);
        return Result.fail(
          arg.message ?? `${arg.name} is not greater than to ${arg.compareTo}`
        );
      case 'gte':
        if (arg.value >= arg.compareTo) return Result.ok(arg.value);
        return Result.fail(
          arg.message ??
            `${arg.name} is not greater than or equal to ${arg.compareTo}`
        );
      case 'lt':
        if (arg.value < arg.compareTo) return Result.ok(arg.value);
        return Result.fail(
          arg.message ?? `${arg.name} is not less than to ${arg.compareTo}`
        );
      case 'lte':
        if (arg.value <= arg.compareTo) return Result.ok(arg.value);
        return Result.fail(
          arg.message ??
            `${arg.name} is not less than or equal to ${arg.compareTo}`
        );
      case 'ne':
        if (arg.value !== arg.compareTo) return Result.ok(arg.value);
        return Result.fail(
          arg.message ?? `${arg.name} shouldn't be equal to ${arg.compareTo}`
        );
      case 'eq':
      default:
        if (arg.value === arg.compareTo) return Result.ok(arg.value);
        return Result.fail(
          arg.message ?? `${arg.name} is not equal to ${arg.compareTo}`
        );
    }
  }

  public static regex(arg: RegexGuardArg): Result<string> {
    if (!arg.regex.test(arg.value))
      return Result.fail(arg.message ?? `Invalid ${arg.name}`);

    return Result.ok(arg.value);
  }
}
