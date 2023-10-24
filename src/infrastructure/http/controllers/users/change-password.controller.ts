import { Request, Response } from 'express-serve-static-core';
import { NotFoundError } from '../../../../application/common/errors';
import { IncorrectPasswordError } from '../../../../application/errors/users/incorrect-password.error';
import {
  ChangePasswordRequest,
  ChangePasswordUseCase,
} from '../../../../application/use-cases/users/change-password.use-case';
import { Controller } from '../../common/controller';
import { Validation } from '../../common/validation';
import { ChangePasswordValidation } from '../../validations/users/change-password.validation';

export class ChangePasswordController extends Controller {
  constructor(
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly changePasswordValidation: Validation<ChangePasswordValidation>
  ) {
    super();
  }

  async executeImpl(req: Request, res: Response) {
    const dtoResult = this.changePasswordValidation.validate({
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
      confirmPassword: req.body.confirmPassword,
    });

    if (!dtoResult.isSuccess)
      return Controller.badRequest(res, dtoResult.error);

    try {
      const changePasswordRequest: ChangePasswordRequest = {
        ...dtoResult.data,
        userId: req.auth!.userId,
      };

      const result = await this.changePasswordUseCase.execute(
        changePasswordRequest
      );

      if (result instanceof NotFoundError)
        return Controller.notFound(res, result.error);
      if (result instanceof IncorrectPasswordError)
        return Controller.badRequest(res, result.error);

      if (!result.isSuccess) return Controller.badRequest(res, result.error);

      return Controller.ok(res);
    } catch (err) {
      Controller.unexpectedError(res, err);
    }
  }
}
