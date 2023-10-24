import { NextFunction, Request, Response } from 'express-serve-static-core';
import { Session } from '../../../domain/models/session/session';
import { SessionsRepository } from '../../../domain/repositories/sessions.repository';
import { Auth0JwtService } from '../../services/auth0-jwt.service';
import { JwtService } from '../../services/jwt.service';
import { Controller } from '../common/controller';
import { Middleware } from '../common/middleware';

export interface AuthContext {
  userId: string;
  token: string;
  provider?: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    auth?: AuthContext;
  }
}

export class AuthMiddleware extends Middleware {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly jwtService: JwtService,
    private readonly auth0JwtService: Auth0JwtService
  ) {
    super();
  }

  private setAuthContext(
    req: Request,
    session: Session,
    provider?: string
  ): void {
    const context: AuthContext = {
      userId: session.userId.toString(),
      token: session.token,
      provider,
    };

    req.auth = context;
  }

  async executeImpl(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.substring(7) ?? '';

      const internalVerify = await this.jwtService.verify(token);

      if (internalVerify) {
        const session = await this.sessionsRepository.getSessionByToken(token);

        if (!session) return Controller.unauthorized(res);

        this.setAuthContext(req, session);

        return next();
      }

      const auth0Verify = await this.auth0JwtService.verify(token);

      if (auth0Verify) {
        const session = await this.sessionsRepository.getSessionByToken(token);

        if (!session) return Controller.unauthorized(res);

        this.setAuthContext(req, session, 'auth0');

        return next();
      }

      return Controller.unauthorized(res);
    } catch (error) {
      console.log(error);
      return Controller.unexpectedError(res, error);
    }
  }
}
