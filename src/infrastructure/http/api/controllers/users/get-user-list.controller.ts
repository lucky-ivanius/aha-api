import { Request, Response } from 'express';
import { z } from 'zod';
import { AccessDeniedError } from '../../../../../application/common/errors';
import {
  defaultPage,
  defaultpageSize,
} from '../../../../../application/dtos/request/common/pagination-request.dto';
import {
  GetUserListRequest,
  GetUserListUseCase,
} from '../../../../../application/use-cases/users/get-user-list.use-case';
import { Controller } from '../../common/controller';

export class GetUserListController extends Controller {
  constructor(private readonly getUserDetailUseCase: GetUserListUseCase) {
    super();
  }

  async executeImpl(req: Request, res: Response) {
    const zodQueryValidate = z.object({
      page: z
        .string()
        .transform(Number)
        .default(defaultPage.toString())
        .refine((arg) => arg > 0, {
          message: 'Page must be greater than 1',
          path: ['page'],
        }),
      pageSize: z
        .string()
        .transform(Number)
        .default(defaultpageSize.toString())
        .refine((arg) => arg >= 10, {
          message: 'Page size must be greater than or equal 10',
          path: ['pageSize'],
        })
        .refine((arg) => arg <= 100, {
          message: 'Page size must be less than or equal 100',
          path: ['pageSize'],
        }),
    });

    const dtoResult = zodQueryValidate.safeParse(req.query);

    if (!dtoResult.success)
      return Controller.badRequest(res, dtoResult.error.issues.at(0)?.message);

    try {
      const getUserDetailRequest: GetUserListRequest = {
        requestUserId: req.auth!.userId,
        page: dtoResult.data.page,
        pageSize: dtoResult.data.pageSize,
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
