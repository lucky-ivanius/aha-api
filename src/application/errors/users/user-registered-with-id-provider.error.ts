import { Result } from '../../../domain/common/result';
import { UseCaseError } from '../../common/use-case';

export class UserRegisteredWithIdProviderError extends Result<UseCaseError> {
  constructor(email: string) {
    super(
      false,
      `User with email ${email} is registered with identity provider`
    );
  }
}
