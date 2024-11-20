import { Response } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { RoleService } from './role.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateRoleDto } from './dto/createRole.dto';
import { RoleEntity } from './entities/role.entity';
import { LoggingInterceptor } from '@interceptors/logging.interceptors';
import { CreateRoleBodySchema } from '@schemas/body-schemas';
import { CreateRoleErrorSchema } from '@schemas/error-schemas';
import { CreateRoleResponseSchema } from '@schemas/respones-schemas';

@ApiTags('Roles CRUD')
@UseInterceptors(LoggingInterceptor)
@Controller('roles')
export class RoleController {
  constructor(private roleService: RoleService) {}

  @ApiOperation({ summary: 'Создание роли' })
  @ApiResponse({
    status: 200,
    type: CreateRoleResponseSchema,
    description: 'Registration user',
  })
  @ApiBadRequestResponse({
    type: CreateRoleErrorSchema,
    description: 'Некорректный запрос',
  })
  @ApiBody({ type: CreateRoleBodySchema })
  @Post('/create')
  async create(@Body() createRoleDto: CreateRoleDto, @Res() res: Response) {
    try {
      const payload = await this.roleService.create(createRoleDto);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Role was add!', ...payload });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }

  @ApiOperation({ summary: 'Получение роли по значению' })
  @ApiResponse({ status: 200, type: RoleEntity })
  @Get('/:value')
  findAll(@Param('value') value: string) {
    return this.roleService.getRoleByValue(value);
  }
}
