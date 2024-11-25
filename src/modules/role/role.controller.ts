import { Response } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  Res,
  UseGuards,
} from '@nestjs/common';
import { RoleService } from './role.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRoleDto } from './dto/createRole.dto';
import { RoleEntity } from './entities/role.entity';
import { LoggingInterceptor } from '@interceptors/logging.interceptors';
import {
  CreateRoleErrorSchema,
  GetRolesErrorSchema,
} from '@schemas/error-schemas';
import {
  CreateRoleResponseSchema,
  GetRolesResponseSchema,
} from '@schemas/respones-schemas';
import { Roles } from '@decorators/roles-auth.decorator';
import { RolesGuard } from '@modules/auth/roles.guard';

@ApiTags('Roles CRUD')
@ApiSecurity('RolesGuard')
@Roles('ADMIN')
@UseGuards(RolesGuard)
@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @ApiOperation({ summary: 'Создание роли' })
  @ApiResponse({
    status: 200,
    type: CreateRoleResponseSchema,
    description: 'Создание роли',
  })
  @ApiBadRequestResponse({
    type: CreateRoleErrorSchema,
    description: 'Конфликт: Указанная роль уже существует',
  })
  @ApiBody({ type: CreateRoleDto })
  @Post('/create')
  async create(@Body() createRoleDto: CreateRoleDto, @Res() res: Response) {
    try {
      const payload = await this.roleService.create(createRoleDto);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Роль была создана', ...payload });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }

  @ApiOperation({ summary: 'Получение всех ролей' })
  @ApiResponse({
    status: 200,
    type: GetRolesResponseSchema,
    description: 'Список всех существующих ролей',
  })
  @ApiResponse({
    status: 400,
    type: GetRolesErrorSchema,
    description: 'Ошибка получения списка ролей',
  })
  @Get('/all')
  async getAllRoles(@Res() res: Response) {
    try {
      const payload = await this.roleService.getAllRoles();
      return res.status(HttpStatus.OK).json({
        message: 'Все существующие роли были супешно получены.',
        ...payload,
      });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }
}
