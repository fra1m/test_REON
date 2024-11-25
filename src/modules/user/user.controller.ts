import { Response } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { RemoveRoleDto } from './dto/updateUser.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { TokenEntity } from '@modules/auth/entities/token.entity';
import { UserEntity } from './entities/user.entity';
import { AuthBodySchema, RegistrationBodySchema } from '@schemas/body-schemas';
import {
  AddRoleErrorSchema,
  AuthErrorSchema,
  DeleteUserErrorSchema,
  RegistrationErrorSchema,
} from '@schemas/error-schemas';
import {
  AddRoleResponseSchema,
  AuthResponseSchema,
  DeleteUserResponseSchema,
  RefreshTokenResponseSchema,
  RegistrationResponseSchema,
  RemoveRoleSchema,
} from '@schemas/respones-schemas';
import { AuthUserDto } from '@modules/auth/dto/authUser.dto';
import { Roles } from '@decorators/roles-auth.decorator';
import { RolesGuard } from '@modules/auth/roles.guard';
import { AddRoleDto } from './dto/addRole.dto';
import { Cookies } from '@decorators/cookie.decorator';
import { CurrentUser } from '@decorators/user-token.decorator';
import { AuthGuard } from '@modules/auth/jwt-auth.guard';

@ApiTags('User CRUD')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Cоздание пользователя' })
  @ApiExtraModels(UserEntity, TokenEntity, CreateUserDto)
  @ApiResponse({
    status: 200,
    type: RegistrationResponseSchema,
    description:
      'Регистрация пользователя (выдает роль администратора автоматически)',
  })
  @ApiBadRequestResponse({
    type: RegistrationErrorSchema,
    description: 'Некорректный запрос',
  })
  @ApiBody({ type: RegistrationBodySchema })
  @Post('/registration')
  async registrationUser(@Body() userDto: CreateUserDto, @Res() res: Response) {
    try {
      const payload = await this.userService.registrationUser(userDto);

      res.cookie('refreshToken', payload.tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
      });
      return res.status(HttpStatus.OK).json({
        message: 'Регистрация прошла успешно, вы можете приступить к работе!',
        ...payload,
      });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @ApiExtraModels(UserEntity, TokenEntity, CreateUserDto)
  @ApiResponse({
    status: 200,
    type: AuthResponseSchema,
    description: 'Авторизация пользователя',
  })
  @ApiBadRequestResponse({
    type: AuthErrorSchema,
    description: 'Некорректный запрос',
  })
  @ApiBody({ type: AuthBodySchema })
  @Post('/auth')
  async authUser(@Body() userDto: AuthUserDto, @Res() res: Response) {
    try {
      const payload = await this.userService.authUser(userDto);
      res.cookie('refreshToken', payload.tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      return res.status(HttpStatus.OK).json({
        message: 'Позздравляю, вы можете приступить к работе!',
        ...payload,
      });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }

  @ApiCookieAuth('refreshToken')
  @ApiOperation({ summary: 'Обновление refreshToken в cookies' })
  @ApiResponse({ status: 200, type: RefreshTokenResponseSchema })
  @Get('/refresh')
  async refresh(@Cookies('refreshToken') token: string, @Res() res: Response) {
    try {
      const payload = await this.userService.refreshToken(token);
      res.cookie('refreshToken', payload.tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.status(HttpStatus.OK).json({
        message: 'Позздравляю, вы можете приступить к работе!',
        ...payload,
      });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }

  @ApiOperation({ summary: 'Добавление роль (только для администратора)' })
  @ApiResponse({
    status: 200,
    type: AddRoleResponseSchema,
    description: 'Добавление роли пользователю',
  })
  @ApiResponse({
    status: 409,
    type: AddRoleErrorSchema,
    description: 'Конфликт: У пользователя уже есть указанная роль',
  })
  @ApiSecurity('RolesGuard')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Patch('/add-role')
  async addRole(@Body() addRoleDto: AddRoleDto, @Res() res: Response) {
    try {
      const payload = await this.userService.addRole(addRoleDto);

      return res.status(HttpStatus.OK).json({
        message: 'Роль была добавлена пользователю успешно!',
        ...payload,
      });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }

  @ApiOperation({ summary: 'Добавление роль (только для администратора)' })
  @ApiResponse({
    status: 200,
    type: RemoveRoleSchema,
    description: 'Добавление роли пользователю',
  })
  @ApiResponse({
    status: 409,
    type: AddRoleErrorSchema,
    description: 'Конфликт: У пользователя уже есть указанная роль',
  })
  @ApiSecurity('RolesGuard')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Patch('/remove-role')
  async removeRole(@Body() removeRoleDto: RemoveRoleDto, @Res() res: Response) {
    try {
      const payload = await this.userService.removeRole(removeRoleDto);

      return res.status(HttpStatus.OK).json({
        message: 'Роль у пользователя успешно удалена!',
        ...payload,
      });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }

  @ApiOperation({ summary: 'Удаление пользователя (архивация)' })
  @ApiResponse({
    status: 200,
    type: DeleteUserResponseSchema,
    description: 'Пользователь успешно удалён',
  })
  @ApiBadRequestResponse({
    type: DeleteUserErrorSchema,
    description: 'Пользователь уже удален',
  })
  @ApiCookieAuth('refreshToken')
  @ApiSecurity('AuthGuard')
  @UseGuards(AuthGuard)
  @Delete('/delete')
  async softDeleteUser(
    @Cookies('refreshToken') token: string,
    @Res() res: Response,
    @CurrentUser() user: UserEntity,
  ) {
    try {
      await this.userService.softDeleteUser(user.id, token);

      return res
        .status(HttpStatus.OK)
        .clearCookie('refreshToken')
        .json({ message: 'Пользователь успешно удалён', user });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }
}
