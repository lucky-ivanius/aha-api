import { Request, Response } from 'express';
import { z } from 'zod';
import { NotFoundError } from '../../../../../application/common/errors';
import { InvalidAccessTokenError } from '../../../../../application/errors/users/invalid-access-token.error';
import {
  VerifyEmailRequest,
  VerifyEmailUseCase,
} from '../../../../../application/use-cases/users/verify-email.use-case';
import { Controller } from '../../common/controller';

export class VerifyEmailController extends Controller {
  constructor(private readonly verifyEmailUseCase: VerifyEmailUseCase) {
    super();
  }

  async executeImpl(req: Request, res: Response) {
    const zodQueryValidate = z.object({
      verifyToken: z.string({
        required_error: 'Token is required',
        invalid_type_error: 'Token must be a string',
      }),
    });

    const dtoResult = zodQueryValidate.safeParse({
      verifyToken: req.query.token,
    });

    if (!dtoResult.success)
      return Controller.badRequest(res, dtoResult.error.issues.at(0)?.message);

    try {
      const verifyEmailRequest: VerifyEmailRequest = {
        verifyToken: dtoResult.data.verifyToken,
      };

      const result = await this.verifyEmailUseCase.execute(verifyEmailRequest);

      if (result instanceof InvalidAccessTokenError)
        return Controller.badRequest(res, result.error);
      if (result instanceof NotFoundError)
        return Controller.notFound(res, result.error);

      if (!result.isSuccess) return Controller.badRequest(res, result.error);

      return Controller.ok(res, result.data);
    } catch (err) {
      Controller.unexpectedError(res, err);
    }
  }
}
