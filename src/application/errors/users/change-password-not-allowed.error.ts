import { Result } from '../../../domain/common/result';
import { UseCaseError } from '../../common/use-case';

export class ChangePasswordNotAllowedError extends Result<UseCaseError> {
  constructor() {
    super(
      false,
      `Changing password for this user is not allowed. Please update your password through your registered provider.`
    );
  }
}
