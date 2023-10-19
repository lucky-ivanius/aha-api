import { Request, Response } from 'express';
import { z } from 'zod';
import {
  AccessDeniedError,
  NotFoundError,
} from '../../../../../application/common/errors';
import { ChangePasswordNotAllowedError } from '../../../../../application/errors/users/change-password-not-allowed.error';
import { IncorrectPasswordError } from '../../../../../application/errors/users/incorrect-password.error';
import {
  ChangePasswordRequest,
  ChangePasswordUseCase,
} from '../../../../../application/use-cases/users/change-password.use-case';
import { Controller } from '../../common/controller';

export class ChangePasswordController extends Controller {
  constructor(private readonly changePasswordUseCase: ChangePasswordUseCase) {
    super();
  }

  async executeImpl(req: Request, res: Response) {
    const zodBodyValidate = z
      .object({
        currentPassword: z
          .string({
            required_error: 'Current password is required',
            invalid_type_error: 'Current password must be a string',
          })
          .describe('Current password'),
        newPassword: z
          .string({
            required_error: 'New password is required',
            invalid_type_error: 'New password must be a string',
          })
          .describe('New Password'),
        confirmPassword: z
          .string({
            required_error: 'Confirmation password is required',
            invalid_type_error: 'Confirmation password must be a string',
          })
          .describe('Confirm Password'),
      })
      .refine(
        ({ newPassword, confirmPassword }) => newPassword === confirmPassword,
        {
          message: "Confirmation password didn't match",
          path: ['confirmPassword'],
        }
      );

    const dtoResult = zodBodyValidate.safeParse(req.body);

    if (!dtoResult.success)
      return Controller.badRequest(res, dtoResult.error.issues.at(0)?.message);

    try {
      const changePasswordRequest = {
        userId: req.auth?.userId,
        currentPassword: dtoResult.data.currentPassword,
        newPassword: dtoResult.data.newPassword,
      } as ChangePasswordRequest;

      const result = await this.changePasswordUseCase.execute(
        changePasswordRequest
      );

      if (result instanceof NotFoundError)
        return Controller.notFound(res, result.error);
      if (result instanceof AccessDeniedError)
        return Controller.forbidden(res, result.error);
      if (result instanceof IncorrectPasswordError)
        return Controller.badRequest(res, result.error);
      if (result instanceof ChangePasswordNotAllowedError)
        return Controller.forbidden(res, result.error);

      if (!result.isSuccess) return Controller.badRequest(res, result.error);

      return Controller.ok(res);
    } catch (err) {
      Controller.unexpectedError(res, err);
    }
  }
}
