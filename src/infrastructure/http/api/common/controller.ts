import { Request, Response } from 'express-serve-static-core';

export abstract class Controller {
  protected abstract executeImpl(req: Request, res: Response): Promise<unknown>;

  public async execute(req: Request, res: Response) {
    try {
      await this.executeImpl(req, res);
    } catch (err) {
      return Controller.unexpectedError(res, err);
    }
  }

  public static sendMessage(res: Response, code: number, message?: string) {
    return res.status(code).json({ message });
  }

  public static ok<T>(res: Response, dto?: T) {
    if (!dto) return res.sendStatus(200);

    return res.status(200).json(dto);
  }

  public static created<T>(res: Response, dto?: T) {
    if (!dto) return res.sendStatus(201);

    return res.status(201);
  }

  public static unexpectedError(res: Response, err?: unknown) {
    console.log(err);
    return this.sendMessage(res, 500, `Unexpected error occured`);
  }

  public static badRequest(res: Response, message?: string) {
    return this.sendMessage(res, 400, message ?? `Bad request`);
  }

  public static unauthorized(res: Response, message?: string) {
    return this.sendMessage(res, 401, message ?? `Unauthorized`);
  }

  public static paymentRequired(res: Response, message?: string) {
    return this.sendMessage(res, 402, message ?? `Payment Required`);
  }

  public static forbidden(res: Response, message?: string) {
    return this.sendMessage(res, 403, message ?? `Forbidden`);
  }

  public static notFound(res: Response, message?: string) {
    return this.sendMessage(res, 404, message ?? `Not found`);
  }

  public static conflict(res: Response, message?: string) {
    return this.sendMessage(res, 409, message ?? `Conflict`);
  }

  public static tooManyRequest(res: Response, message?: string) {
    return this.sendMessage(res, 409, message ?? `Too many request`);
  }
}
