import { Request, Response } from 'express-serve-static-core';
import { AccessDeniedError } from '../../../../application/common/errors';
import { InvalidAccessTokenError } from '../../../../application/errors/users/invalid-access-token.error';
import {
  ChangeAuth0PasswordRequest,
  ChangeAuth0PasswordUseCase,
} from '../../../../application/use-cases/users/change-auth0-password.use-case';
import { Controller } from '../../common/controller';
import { Validation } from '../../common/validation';
import { ChangeAuth0PasswordValidation } from '../../validations/users/change-auth0-password.validation';

export class ChangeAuth0PasswordController extends Controller {
  constructor(
    private readonly changeAuth0PasswordUseCase: ChangeAuth0PasswordUseCase,
    private readonly changeAuth0PasswordValidation: Validation<ChangeAuth0PasswordValidation>
  ) {
    super();
  }

  async executeImpl(req: Request, res: Response) {
    const dtoResult = this.changeAuth0PasswordValidation.validate({
      newPassword: req.body.newPassword,
      confirmPassword: req.body.confirmPassword,
    });

    if (!dtoResult.isSuccess)
      return Controller.badRequest(res, dtoResult.error);

    try {
      const changeAuth0PasswordRequest: ChangeAuth0PasswordRequest = {
        ...dtoResult.data,
        accessToken: req.auth!.token,
      };

      const result = await this.changeAuth0PasswordUseCase.execute(
        changeAuth0PasswordRequest
      );

      if (result instanceof InvalidAccessTokenError)
        return Controller.badRequest(res, result.error);
      if (result instanceof AccessDeniedError)
        return Controller.forbidden(res, result.error);

      if (!result.isSuccess) return Controller.badRequest(res, result.error);

      return Controller.ok(res);
    } catch (err) {
      Controller.unexpectedError(res, err);
    }
  }
}
