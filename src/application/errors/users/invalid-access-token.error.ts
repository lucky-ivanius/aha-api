import { Result } from '../../../domain/common/result';
import { UseCaseError } from '../../common/errors';

export class InvalidAccessTokenError extends Result<UseCaseError> {
  constructor() {
    super(false, `Invalid access token`);
  }
}
