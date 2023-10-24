import { Result } from '../../../domain/common/result';
import { UseCaseError } from '../../common/errors';

export class InvalidCredentialError extends Result<UseCaseError> {
  constructor() {
    super(false, `Invalid credential`);
  }
}
