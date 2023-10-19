import { Result } from '../../domain/common/result';
import { UseCaseError } from './use-case';

export class UnexpectedError extends Result<UseCaseError> {
  constructor(err: unknown) {
    super(false, 'An unexpected error occured', err as UseCaseError);
  }
}

export class NotFoundError extends Result<UseCaseError> {
  constructor(model: string, arg: unknown) {
    super(false, `${model} (${arg}) was not found`);
  }
}

export class AccessDeniedError extends Result<UseCaseError> {
  constructor() {
    super(false, `Access denied`);
  }
}
