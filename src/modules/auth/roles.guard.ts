import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../../decorators/roles-auth.decorator';
import { Reflector } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { UserService } from '@modules/user/user.service';
import { RoleEntity } from '@modules/role/entities/role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private configService: ConfigService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
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

      const cookies = this.extractTokensFromCookie(cookie);
      const refreshToken = cookies['refreshToken'];

      if (!refreshToken) {
        throw new HttpException(
          'Пользователь не авторизован!',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const user = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      req.user = user;

      if (
        user.roles.some((role: RoleEntity) =>
          requareRoles.includes(role.value),
        ) === false
      ) {
        throw new HttpException('У вас нет доступа!', HttpStatus.FORBIDDEN);
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  private extractTokensFromCookie(cookie: string): Record<string, string> {
    const cookies: Record<string, string> = {};
    cookie.split(';').forEach((item) => {
      const [key, value] = item.split('=').map((part) => part.trim());
      if (key && value) {
        cookies[key] = value;
      }
    });
    return cookies;
  }
}
