import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const cookie = req.headers.cookie;

      if (!cookie) {
        throw new HttpException(
          'Отсутствует заголовок Cookie',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const token = this.extractTokenFromCookie(cookie);

      if (!token) {
        throw new HttpException(
          'Пользователь не авторизован!',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const user = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      req.user = user;
      return true;
    } catch (error) {
      throw new HttpException(
        'Пользователь не авторизован',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  private extractTokenFromCookie(cookie: string): string | null {
    const cookies = cookie.split(';');
    for (const item of cookies) {
      const [key, value] = item.split('=').map((part) => part.trim());
      if (key === 'refreshToken') {
        return value;
      }
    }
    return null;
  }
}
