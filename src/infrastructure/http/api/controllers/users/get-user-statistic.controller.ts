import { Request, Response } from 'express-serve-static-core';
import { AccessDeniedError } from '../../../../../application/common/errors';
import {
  GetUserStatisticRequest,
  GetUserStatisticUseCase,
} from '../../../../../application/use-cases/users/get-user-statistic.use-case';
import { Controller } from '../../common/controller';

export class GetUserStatisticController extends Controller {
  constructor(private readonly getUserDetailUseCase: GetUserStatisticUseCase) {
    super();
  }

  async executeImpl(req: Request, res: Response) {
    try {
      const getUserDetailRequest: GetUserStatisticRequest = {
        requestUserId: req.auth!.userId,
      };

      const result =
        await this.getUserDetailUseCase.execute(getUserDetailRequest);

      if (result instanceof AccessDeniedError)
        return Controller.forbidden(res, result.error);

      if (!result.isSuccess) return Controller.badRequest(res, result.error);

      return Controller.ok(res, result.data);
    } catch (err) {
      Controller.unexpectedError(res, err);
    }
  }
}
