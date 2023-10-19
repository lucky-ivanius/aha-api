import { Request, Response } from 'express-serve-static-core';
import { InvalidAccessTokenError } from '../../../../../application/errors/users/invalid-access-token.error';
import { UserRegisteredWithEmailError } from '../../../../../application/errors/users/user-registered-with-email.error';
import {
  LoginWithIdProviderRequest,
  LoginWithIdProviderUseCase,
} from '../../../../../application/use-cases/users/login-with-id-provider.use-case';
import { Controller } from '../../common/controller';

export class LoginWithAuth0Controller extends Controller {
  constructor(
    private readonly loginWithIdProviderUseCase: LoginWithIdProviderUseCase
  ) {
    super();
  }

  async executeImpl(req: Request, res: Response) {
    try {
      const loginWithIdProviderRequest: LoginWithIdProviderRequest = {
        accessToken: req.headers.authorization?.substring(7) ?? '',
      };

      const result = await this.loginWithIdProviderUseCase.execute(
        loginWithIdProviderRequest
      );

      if (result instanceof InvalidAccessTokenError)
        return Controller.badRequest(res, result.error);
      if (result instanceof UserRegisteredWithEmailError)
        return Controller.forbidden(res, result.error);

      if (!result.isSuccess) return Controller.badRequest(res, result.error);

      return Controller.ok(res, result.data);
    } catch (err) {
      Controller.unexpectedError(res, err);
    }
  }
}
