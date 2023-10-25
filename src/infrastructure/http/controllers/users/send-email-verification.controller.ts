import { Request, Response } from 'express-serve-static-core';
import { NotFoundError } from '../../../../application/common/errors';
import { EmailHasBeenVerifiedError } from '../../../../application/errors/users/email-has-been-verified.error';
import {
  SendEmailVerificationRequest,
  SendEmailVerificationUseCase,
} from '../../../../application/use-cases/users/send-email-verification.use-case';
import { appConfig } from '../../../config/app.config';
import { Controller } from '../../common/controller';

export class SendEmailVerificationController extends Controller {
  constructor(
    private readonly sendEmailVerificationUseCase: SendEmailVerificationUseCase
  ) {
    super();
  }

  async executeImpl(req: Request, res: Response) {
    try {
      const sendEmailVerificationRequest: SendEmailVerificationRequest = {
        userId: req.auth!.userId,
        verifyEndpoint: `${appConfig.url}/api/v1/users/verify`,
      };

      const result = await this.sendEmailVerificationUseCase.execute(
        sendEmailVerificationRequest
      );

      if (result instanceof NotFoundError)
        return Controller.notFound(res, result.error);
      if (result instanceof EmailHasBeenVerifiedError)
        return Controller.badRequest(res, result.error);

      if (!result.isSuccess) return Controller.badRequest(res, result.error);

      return Controller.ok(res);
    } catch (err) {
      Controller.unexpectedError(res, err);
    }
  }
}
