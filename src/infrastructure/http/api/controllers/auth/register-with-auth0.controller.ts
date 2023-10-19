import { Request, Response } from 'express-serve-static-core';
import { EmailAlreadyExistsError } from '../../../../../application/errors/users/email-already-exists.error';
import { InvalidAccessTokenError } from '../../../../../application/errors/users/invalid-access-token.error';
import {
  RegisterWithIdProviderRequest,
  RegisterWithIdProviderUseCase,
} from '../../../../../application/use-cases/users/register-with-id-provider.use-case';
import { Controller } from '../../common/controller';

export class RegisterWithAuth0Controller extends Controller {
  constructor(
    private readonly registerWithIdProviderUseCase: RegisterWithIdProviderUseCase
  ) {
    super();
  }

  async executeImpl(req: Request, res: Response) {
    try {
      const registerWithIdProviderRequest: RegisterWithIdProviderRequest = {
        accessToken: req.headers.authorization?.substring(7) ?? '',
      };

      const result = await this.registerWithIdProviderUseCase.execute(
        registerWithIdProviderRequest
      );

      if (result instanceof InvalidAccessTokenError)
        return Controller.badRequest(res, result.error);
      if (result instanceof EmailAlreadyExistsError)
        return Controller.badRequest(res, result.error);

      if (!result.isSuccess) return Controller.badRequest(res, result.error);

      return Controller.created(res);
    } catch (err) {
      Controller.unexpectedError(res, err);
    }
  }
}
