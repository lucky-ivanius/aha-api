import { Request, Response } from 'express-serve-static-core';
import { z } from 'zod';
import { EmailAlreadyExistsError } from '../../../../../application/errors/users/email-already-exists.error';
import { InvalidAccessTokenError } from '../../../../../application/errors/users/invalid-access-token.error';
import {
  RegisterRequest,
  RegisterUseCase,
} from '../../../../../application/use-cases/users/register.use-case';
import { appConfig } from '../../../../config/app.config';
import { Controller } from '../../common/controller';

export class RegisterController extends Controller {
  constructor(private readonly registerUseCase: RegisterUseCase) {
    super();
  }

  async executeImpl(req: Request, res: Response) {
    const zodBodyValidate = z.object({
      name: z
        .string({
          required_error: 'Name is required',
          invalid_type_error: 'Name must be a string',
        })
        .min(2, {
          message: 'Name must be contain at least 2 characters',
        })
        .trim()
        .describe('Name'),
      email: z
        .string({
          required_error: 'Email is required',
          invalid_type_error: 'Email must be a string',
        })
        .email()
        .trim()
        .describe('Email'),
      password: z.string().describe('Password'),
    });

    const dtoResult = zodBodyValidate.safeParse(req.body);

    if (!dtoResult.success)
      return Controller.badRequest(res, dtoResult.error.issues.at(0)?.message);

    try {
      const registerRequest: RegisterRequest = {
        name: dtoResult.data.name,
        email: dtoResult.data.email,
        password: dtoResult.data.password,
        verifyUrl: appConfig.url,
      };

      const result = await this.registerUseCase.execute(registerRequest);

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
