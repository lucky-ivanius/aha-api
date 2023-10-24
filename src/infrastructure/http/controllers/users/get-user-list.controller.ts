import { Request, Response } from 'express-serve-static-core';
import { AccessDeniedError } from '../../../../application/common/errors';
import {
  GetUserListRequest,
  GetUserListUseCase,
} from '../../../../application/use-cases/users/get-user-list.use-case';
import { Controller } from '../../common/controller';
import { Validation } from '../../common/validation';
import { GetUserListValidation } from '../../validations/users/get-user-list.validation';

export class GetUserListController extends Controller {
  constructor(
    private readonly getUserListUseCase: GetUserListUseCase,
    private readonly getUserListValidation: Validation<GetUserListValidation>
  ) {
    super();
  }

  async executeImpl(req: Request, res: Response) {
    const dtoResult = this.getUserListValidation.validate({
      page: req.query.page,
      pageSize: req.query.pageSize,
    });

    if (!dtoResult.isSuccess)
      return Controller.badRequest(res, dtoResult.error);

    try {
      const getUserDetailRequest: GetUserListRequest = {
        ...dtoResult.data,
        requestUserId: req.auth!.userId,
      };

      const result =
        await this.getUserListUseCase.execute(getUserDetailRequest);

      if (result instanceof AccessDeniedError)
        return Controller.forbidden(res, result.error);

      if (!result.isSuccess) return Controller.badRequest(res, result.error);

      return Controller.ok(res, result.data);
    } catch (err) {
      Controller.unexpectedError(res, err);
    }
  }
}
