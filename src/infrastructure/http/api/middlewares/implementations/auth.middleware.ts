import { NextFunction, Request, Response } from 'express';
import { SessionsRepository } from '../../../../../domain/repositories/sessions.repository';
import { TokenService } from '../../../../../domain/services/token.service';
import { Auth0Service } from '../../../../services/implementations/auth0.service';
import { Controller } from '../../common/controller';
import { Middleware } from '../../common/middleware';

export interface AuthContext {
  userId: string;
}

declare module 'express' {
  interface Request {
    auth?: AuthContext;
  }
}

export class AuthMiddleware extends Middleware {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly tokenService: TokenService,
    private readonly auth0Service: Auth0Service
  ) {
    super();
  }

  private async getUserIdByToken(token: string): Promise<string | null> {
    const session = await this.sessionsRepository.getSessionByToken(token);

    if (!session) return null;

    return session.userId.toString();
  }

  private setAuthContext(req: Request, context: AuthContext): void {
    req.auth = context;
  }

  async executeImpl(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.substring(7) ?? '';

      const internalVerify = await this.tokenService.verify(token);

      if (internalVerify) {
        const userId = await this.getUserIdByToken(token);

        if (!userId) return Controller.unauthorized(res);

        this.setAuthContext(req, { userId });

        return next();
      }

      const auth0Verify = await this.auth0Service.verify(token);

      if (auth0Verify) {
        const userId = await this.getUserIdByToken(token);

        if (!userId) return Controller.unauthorized(res);

        this.setAuthContext(req, { userId });

        return next();
      }

      return Controller.unauthorized(res);
    } catch (error) {
      console.log(error);
      return Controller.unexpectedError(res, error);
    }
  }
}
