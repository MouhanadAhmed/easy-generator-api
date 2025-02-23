import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService
  ) {}

  extractToken(request): string {
    const authorizationHeader = request.headers['authorization'];
    if (!authorizationHeader) {
      throw new UnauthorizedException('Access is denied due to missing token.');
    }
    const token = authorizationHeader.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Access is denied due to missing token.');
    }
    return token;
  }

  validateToken(token: string): void {
    try {
      this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_KEY'),
      });
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }

  async getUserFromToken(token: string) {
    const decoded = this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_KEY'),
    });
    const user = await this.userService.findOne({ email: decoded.email });
    if (!user || (!user.isActive && user.role !== 'integration')) {
      throw new UnauthorizedException('Invalid userId');
    }
    return user;
  }
}
