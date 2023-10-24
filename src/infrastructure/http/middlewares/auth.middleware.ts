import { NextFunction, Request, Response } from 'express-serve-static-core';
import { Id } from '../../../domain/common/id';
import { UsersRepository } from '../../../domain/repositories/users.repository';
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
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly auth0JwtService: Auth0JwtService
  ) {
    super();
  }

  private setAuthContext(req: Request, context: AuthContext): void {
    req.auth = context;
  }

  async executeImpl(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.substring(7) ?? '';

      const internalVerify = await this.jwtService.verify(token);

      if (internalVerify) {
        const user = await this.usersRepository.findById(
          new Id(internalVerify.sub)
        );

        if (!user) return Controller.unauthorized(res);

        this.setAuthContext(req, {
          userId: user.id.toString(),
          token,
        });

        return next();
      }

      const auth0Verify = await this.auth0JwtService.verify(token);

      if (auth0Verify) {
        const user = await this.usersRepository.findByProvider(
          'auth0',
          auth0Verify.sub
        );

        if (!user) return Controller.unauthorized(res);

        this.setAuthContext(req, {
          userId: user.id.toString(),
          token,
          provider: 'auth0',
        });

        return next();
      }

      return Controller.unauthorized(res);
    } catch (error) {
      console.log(error);
      return Controller.unexpectedError(res, error);
    }
  }
}
