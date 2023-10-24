import { Result } from '../../../domain/common/result';
import { UseCaseError } from '../../common/errors';

export class InvalidVerifyTokenError extends Result<UseCaseError> {
  constructor() {
    super(false, `Invalid verification token`);
  }
}
