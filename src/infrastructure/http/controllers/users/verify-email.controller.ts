import { Request, Response } from 'express-serve-static-core';
import { NotFoundError } from '../../../../application/common/errors';
import { InvalidVerifyTokenError } from '../../../../application/errors/users/invalid-verify-token.error';
import {
  VerifyEmailRequest,
  VerifyEmailUseCase,
} from '../../../../application/use-cases/users/verify-email.use-case';
import { Controller } from '../../common/controller';
import { Validation } from '../../common/validation';
import { VerifyEmailValidation } from '../../validations/users/verify-email.validation';

export class VerifyEmailController extends Controller {
  constructor(
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly verifyEmailValidation: Validation<VerifyEmailValidation>
  ) {
    super();
  }

  async executeImpl(req: Request, res: Response) {
    const dtoResult = this.verifyEmailValidation.validate({
      verifyToken: req.query.token,
    });

    if (!dtoResult.isSuccess)
      return Controller.badRequest(res, dtoResult.error);

    try {
      const verifyEmailRequest: VerifyEmailRequest = dtoResult.data;

      const result = await this.verifyEmailUseCase.execute(verifyEmailRequest);

      if (result instanceof InvalidVerifyTokenError)
        return Controller.badRequest(res, result.error);
      if (result instanceof NotFoundError)
        return Controller.notFound(res, result.error);

      if (!result.isSuccess) return Controller.badRequest(res, result.error);

      return Controller.ok(res, {
        message: 'Email verified sucessfully',
      });
    } catch (err) {
      Controller.unexpectedError(res, err);
    }
  }
}
