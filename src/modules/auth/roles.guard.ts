import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './roles-auth.decorator';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requareRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!requareRoles) {
        return true;
      }

      const req = context.switchToHttp().getRequest();

      const cookie = req.headers.cookie;

      if (!cookie) {
        throw new HttpException(
          'Отсутствует заголовок Cookie!',
          HttpStatus.BAD_REQUEST,
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

      if (
        user.roles.some((role: any) => requareRoles.includes(role.value)) ===
        false
      ) {
        throw new HttpException('У вас нет доступа!', HttpStatus.FORBIDDEN);
      }

      return true;
    } catch (error) {
      throw error 
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
