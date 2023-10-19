import { Request, Response } from 'express';
import { z } from 'zod';
import { InvalidCredentialError } from '../../../../../application/errors/users/invalid-credential.error';
import { UserRegisteredWithIdProviderError } from '../../../../../application/errors/users/user-registered-with-id-provider.error';
import {
  LoginRequest,
  LoginUseCase,
} from '../../../../../application/use-cases/users/login.use-case';
import { Controller } from '../../common/controller';

export class LoginController extends Controller {
  constructor(private readonly loginUseCase: LoginUseCase) {
    super();
  }

  async executeImpl(req: Request, res: Response) {
    const zodBodyValidate = z.object({
      email: z
        .string({
          required_error: 'Email is required',
          invalid_type_error: 'Email must be a string',
        })
        .toLowerCase()
        .trim()
        .describe('Email'),
      password: z.string().describe('Password'),
    });

    const dtoResult = zodBodyValidate.safeParse(req.body);

    if (!dtoResult.success)
      return Controller.badRequest(res, dtoResult.error.issues.at(0)?.message);

    try {
      console.log(dtoResult.data);
      const loginRequest: LoginRequest = {
        email: dtoResult.data.email,
        password: dtoResult.data.password,
      };

      const result = await this.loginUseCase.execute(loginRequest);

      if (result instanceof InvalidCredentialError)
        return Controller.badRequest(res, result.error);
      if (result instanceof UserRegisteredWithIdProviderError)
        return Controller.forbidden(res, result.error);

      if (!result.isSuccess) return Controller.badRequest(res, result.error);

      return Controller.ok(res, result.data);
    } catch (err) {
      Controller.unexpectedError(res, err);
    }
  }
}
