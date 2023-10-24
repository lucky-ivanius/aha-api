import { Request, Response } from 'express-serve-static-core';
import { NotFoundError } from '../../../../application/common/errors';
import {
  UpdateNameRequest,
  UpdateNameUseCase,
} from '../../../../application/use-cases/users/update-name.use-case';
import { Controller } from '../../common/controller';
import { Validation } from '../../common/validation';
import { UpdateNameValidation } from '../../validations/users/update-name.validation';

export class UpdateCurrentNameController extends Controller {
  constructor(
    private readonly updateNameUseCase: UpdateNameUseCase,
    private readonly updateNameValidation: Validation<UpdateNameValidation>
  ) {
    super();
  }

  async executeImpl(req: Request, res: Response) {
    const dtoResult = this.updateNameValidation.validate({
      userId: req.auth!.userId,
      name: req.body.name,
    });

    if (!dtoResult.isSuccess)
      return Controller.badRequest(res, dtoResult.error);

    try {
      const updateNameRequest: UpdateNameRequest = dtoResult.data;

      const result = await this.updateNameUseCase.execute(updateNameRequest);

      if (result instanceof NotFoundError)
        return Controller.notFound(res, result.error);

      if (!result.isSuccess) return Controller.badRequest(res, result.error);

      return Controller.ok(res, result.data);
    } catch (err) {
      Controller.unexpectedError(res, err);
    }
  }
}
