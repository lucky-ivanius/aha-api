import { Result } from '../../../domain/common/result';
import { UseCaseError } from '../../common/use-case';

export class IncorrectPasswordError extends Result<UseCaseError> {
  constructor() {
    super(false, `Password is not correct`);
  }
}
