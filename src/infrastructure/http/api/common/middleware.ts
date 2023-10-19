import { NextFunction, Request, Response } from 'express-serve-static-core';
import { Controller } from './controller';

export abstract class Middleware {
  protected abstract executeImpl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<unknown>;

  public async execute(req: Request, res: Response, next: NextFunction) {
    try {
      await this.executeImpl(req, res, next);
    } catch (err) {
      Controller.unexpectedError(res, err);
    }
  }
}
