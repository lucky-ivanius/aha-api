import { Result } from '../../../domain/common/result';
import { UseCaseError } from '../../common/use-case';

export class InvalidAccessTokenError extends Result<UseCaseError> {
  constructor() {
    super(false, `Invalid access token`);
  }
}
