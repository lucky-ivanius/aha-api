import { Result } from '../../../domain/common/result';
import { UseCaseError } from '../../common/errors';

export class EmailAlreadyExistsError extends Result<UseCaseError> {
  constructor(email: string) {
    super(false, `The email ${email} associated for this user already exists.`);
  }
}
