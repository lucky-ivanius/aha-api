import { Request, Response } from 'express-serve-static-core';
import { EmailAlreadyExistsError } from '../../../../application/errors/users/email-already-exists.error';
import {
  RegisterRequest,
  RegisterUseCase,
} from '../../../../application/use-cases/users/register.use-case';
import { appConfig } from '../../../config/app.config';
import { Controller } from '../../common/controller';
import { Validation } from '../../common/validation';
import { RegisterValidation } from '../../validations/auth/register.validation';

export class RegisterController extends Controller {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly registerUserValidation: Validation<RegisterValidation>
  ) {
    super();
  }

  async executeImpl(req: Request, res: Response) {
    const dtoResult = this.registerUserValidation.validate({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    if (!dtoResult.isSuccess)
      return Controller.badRequest(res, dtoResult.error);

    try {
      const registerRequest: RegisterRequest = {
        ...dtoResult.data,
        verifyEndpoint: `${appConfig.url}/api/v1/users/verify`,
      };

      const result = await this.registerUseCase.execute(registerRequest);

      if (result instanceof EmailAlreadyExistsError)
        return Controller.badRequest(res, result.error);

      if (!result.isSuccess) return Controller.badRequest(res, result.error);

      return Controller.created(res);
    } catch (err) {
      Controller.unexpectedError(res, err);
    }
  }
}
