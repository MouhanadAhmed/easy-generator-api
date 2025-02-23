import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenService } from './token.service';
import { SKIP_AUTH_KEY } from './skip.auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private tokenService: TokenService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.isAuthSkipped(context)) return true;

    try {
      const request = context.switchToHttp().getRequest();
      const token = this.tokenService.extractToken(request);
      this.tokenService.validateToken(token);
      const user = await this.tokenService.getUserFromToken(token);
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException(
        `Unauthorized: Access is denied due to invalid token. error: ${error.message}`
      );
    }
  }

  private isAuthSkipped(context: ExecutionContext): boolean {
    return this.reflector.get<boolean>(SKIP_AUTH_KEY, context.getHandler());
  }
}
