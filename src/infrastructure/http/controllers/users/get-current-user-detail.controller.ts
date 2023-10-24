import { Request, Response } from 'express-serve-static-core';
import { NotFoundError } from '../../../../application/common/errors';
import {
  GetUserDetailRequest,
  GetUserDetailUseCase,
} from '../../../../application/use-cases/users/get-user-detail.use-case';
import { Controller } from '../../common/controller';

export class GetCurrentUserDetailController extends Controller {
  constructor(private readonly getUserDetailUseCase: GetUserDetailUseCase) {
    super();
  }

  async executeImpl(req: Request, res: Response) {
    try {
      const getUserDetailRequest: GetUserDetailRequest = {
        userId: req.auth!.userId,
      };

      const result =
        await this.getUserDetailUseCase.execute(getUserDetailRequest);

      if (result instanceof NotFoundError) return Controller.unauthorized(res);

      if (!result.isSuccess) return Controller.badRequest(res, result.error);

      return Controller.ok(res, result.data);
    } catch (err) {
      Controller.unexpectedError(res, err);
    }
  }
}
