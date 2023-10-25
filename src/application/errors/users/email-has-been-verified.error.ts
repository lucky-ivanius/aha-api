import { Result } from '../../../domain/common/result';
import { UseCaseError } from '../../common/errors';

export class EmailHasBeenVerifiedError extends Result<UseCaseError> {
  constructor(email: string) {
    super(false, `The email ${email} has been verified.`);
  }
}
