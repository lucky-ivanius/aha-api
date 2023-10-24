import { Result } from '../../domain/common/result';

export type UseCaseError =
  | {
      [key: string]: unknown;
    }
  | unknown;

export class UnexpectedError extends Result<UseCaseError> {
  constructor(err: unknown) {
    console.error(err);
    super(false, 'An unexpected error occured', err as UseCaseError);
  }
}

export class NotFoundError extends Result<UseCaseError> {
  constructor(model: string, arg?: unknown) {
    super(
      false,
      !!arg ? `${model} (${arg}) was not found` : `${model} was not found`
    );
  }
}

export class AccessDeniedError extends Result<UseCaseError> {
  constructor() {
    super(false, `Access denied`);
  }
}
