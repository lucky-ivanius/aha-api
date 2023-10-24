import { Request, Response } from 'express-serve-static-core';
import { InvalidAccessTokenError } from '../../../../application/errors/users/invalid-access-token.error';
import {
  LoginWithAuth0Request,
  LoginWithAuth0UseCase,
} from '../../../../application/use-cases/users/login-with-auth0.use-case';
import { Controller } from '../../common/controller';
import { Validation } from '../../common/validation';
import { LoginWithAuth0Validation } from '../../validations/auth/login-with-auth0.validation';

export class LoginWithAuth0Controller extends Controller {
  constructor(
    private readonly loginWithAuth0UseCase: LoginWithAuth0UseCase,
    private readonly loginWithAuth0Validation: Validation<LoginWithAuth0Validation>
  ) {
    super();
  }

  async executeImpl(req: Request, res: Response) {
    const dtoResult = this.loginWithAuth0Validation.validate({
      accessToken: req.headers.authorization?.substring(7),
    });

    if (!dtoResult.isSuccess)
      return Controller.badRequest(res, dtoResult.error);

    try {
      const loginWithAuth0Request: LoginWithAuth0Request = dtoResult.data;

      const result = await this.loginWithAuth0UseCase.execute(
        loginWithAuth0Request
      );

      if (result instanceof InvalidAccessTokenError)
        return Controller.badRequest(res, result.error);

      if (!result.isSuccess) return Controller.badRequest(res, result.error);

      return Controller.ok(res, result.data);
    } catch (err) {
      Controller.unexpectedError(res, err);
    }
  }
}
