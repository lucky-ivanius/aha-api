import { Request, Response } from 'express-serve-static-core';
import { NotFoundError } from '../../../../../application/common/errors';
import {
  UpdateNameRequest,
  UpdateNameUseCase,
} from '../../../../../application/use-cases/users/update-name.use-case';
import { Controller } from '../../common/controller';

export class UpdateCurrentUserNameController extends Controller {
  constructor(private readonly getUserDetailUseCase: UpdateNameUseCase) {
    super();
  }

  async executeImpl(req: Request, res: Response) {
    try {
      const getUserDetailRequest: UpdateNameRequest = {
        userId: req.auth!.userId,
        name: req.body.name,
      };

      const result =
        await this.getUserDetailUseCase.execute(getUserDetailRequest);

      if (result instanceof NotFoundError)
        return Controller.notFound(res, result.error);

      if (!result.isSuccess) return Controller.badRequest(res, result.error);

      return Controller.ok(res, result.data);
    } catch (err) {
      Controller.unexpectedError(res, err);
    }
  }
}
