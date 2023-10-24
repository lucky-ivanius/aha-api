import { Request, Response } from 'express-serve-static-core';
import { InvalidCredentialError } from '../../../../application/errors/users/invalid-credential.error';
import {
  LoginRequest,
  LoginUseCase,
} from '../../../../application/use-cases/users/login.use-case';
import { Controller } from '../../common/controller';
import { Validation } from '../../common/validation';
import { LoginValidation } from '../../validations/auth/login.validation';

export class LoginController extends Controller {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly loginValidation: Validation<LoginValidation>
  ) {
    super();
  }

  async executeImpl(req: Request, res: Response) {
    const dtoResult = this.loginValidation.validate({
      email: req.body.email,
      password: req.body.password,
    });

    if (!dtoResult.isSuccess)
      return Controller.badRequest(res, dtoResult.error);

    try {
      const loginRequest: LoginRequest = dtoResult.data;

      const result = await this.loginUseCase.execute(loginRequest);

      if (result instanceof InvalidCredentialError)
        return Controller.badRequest(res, result.error);

      if (!result.isSuccess) return Controller.badRequest(res, result.error);

      return Controller.ok(res, result.data);
    } catch (err) {
      Controller.unexpectedError(res, err);
    }
  }
}
