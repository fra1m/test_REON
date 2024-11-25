import { Response } from 'express';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/createProject.dto';
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
import { AuthGuard } from '@modules/auth/jwt-auth.guard';
import { ProjectEntity } from './entities/project.entity';
import { TokenEntity } from '@modules/auth/entities/token.entity';
import { UserEntity } from '@modules/user/entities/user.entity';
import { CreateProjectBodySchema } from '@schemas/body-schemas';
import { Roles } from '@decorators/roles-auth.decorator';
import { RolesGuard } from '@modules/auth/roles.guard';
import {
  AddUserForProjectResponseSchema,
  CreateProjectResponseSchema,
  DeleteForProjectResponseSchema,
  DeleteUserResponseSchema,
  RemoveUserForProjectResponseSchema,
  UpdateProjectResponseSchema,
} from '@schemas/respones-schemas';
import { CurrentUser } from '@decorators/user-token.decorator';
import { UpdateProjectDto } from './dto/updateProject.dto';
import {
  AddUserForProjectErrorSchema,
  CreateProjectErrorSchema,
  DeleteProjectErrorSchema,
  DeleteUserErrorSchema,
  RemoveUserForProjectErrorSchema,
  UpdateProjectErrorSchema,
} from '@schemas/error-schemas';
import { UserForProjectDto } from './dto/addUserForProject.dto';

@ApiTags('Project CRUD')
@ApiSecurity('RolesGuard')
@UseGuards(RolesGuard)
@Roles('ADMIN')
@ApiCookieAuth('refreshToken')
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({ summary: 'Cоздание проекта (Администратор)' })
  @ApiExtraModels(UserEntity, ProjectEntity, TokenEntity, UpdateProjectDto)
  @ApiResponse({
    status: 200,
    type: CreateProjectResponseSchema,
    description: 'Создание проекта',
  })
  @ApiBadRequestResponse({
    type: CreateProjectErrorSchema,
    description: 'Некорректный запрос',
  })
  @ApiBody({ type: CreateProjectBodySchema })
  @Post('/create')
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @Res() res: Response,
    @CurrentUser() user: UserEntity,
  ) {
    try {
      createProjectDto.author = user;
      const payload = await this.projectService.createProject(createProjectDto);

      return res
        .status(HttpStatus.OK)
        .json({ message: 'Проект был создан', ...payload });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }

  @ApiOperation({ summary: 'Добавление пользователя в проект (Администратор)' })
  @ApiExtraModels(UserEntity, ProjectEntity, TokenEntity, UserForProjectDto)
  @ApiResponse({
    status: 200,
    type: AddUserForProjectResponseSchema,
    description: 'Добавление пользователя в проект',
  })
  @ApiBadRequestResponse({
    type: AddUserForProjectErrorSchema,
    description: 'Некорректный запрос',
  })
  @ApiBody({ type: UserForProjectDto })
  @ApiCookieAuth('refreshToken')
  @Patch(':id/add-user')
  async addUser(
    @Param('id') id: number,
    @Body() addUserForProjectDto: UserForProjectDto,
    @Res() res: Response,
  ) {
    try {
      const payload = await this.projectService.addUserForProject(
        addUserForProjectDto,
        id,
      );

      return res.status(HttpStatus.OK).json({
        message: 'Пользователь успешно добавлен к задаче',
        ...payload,
      });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }

  @ApiOperation({ summary: 'Удаление пользователя из проекта (Администратор)' })
  @ApiExtraModels(UserEntity, ProjectEntity, TokenEntity, UserForProjectDto)
  @ApiResponse({
    status: 200,
    type: RemoveUserForProjectResponseSchema,
    description: 'Удаление пользователя из проекта',
  })
  @ApiBadRequestResponse({
    type: RemoveUserForProjectErrorSchema,
    description: 'Некорректный запрос',
  })
  @ApiBody({ type: UserForProjectDto })
  @ApiCookieAuth('refreshToken')
  @Patch(':id/remove-user')
  async removeUser(
    @Param('id') id: number,
    @Body() addUserForProjectDto: UserForProjectDto,
    @Res() res: Response,
  ) {
    try {
      const payload = await this.projectService.removeUserForProject(
        addUserForProjectDto,
        id,
      );

      return res.status(HttpStatus.OK).json({
        message: 'Пользователь успешно удален',
        ...payload,
      });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }

  @ApiOperation({ summary: 'Редактирование проекта (Администратор)' })
  @ApiExtraModels(UserEntity, ProjectEntity, TokenEntity, UpdateProjectDto)
  @ApiResponse({
    status: 200,
    type: UpdateProjectResponseSchema,
    description: 'Редактирование проекта',
  })
  @ApiBadRequestResponse({
    type: UpdateProjectErrorSchema,
    description: 'Некорректный запрос',
  })
  @ApiBody({ type: UpdateProjectDto })
  @ApiCookieAuth('refreshToken')
  @Patch(':id/patch')
  async patch(
    @Param('id') id: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @Res() res: Response,
  ) {
    try {
      const { project, changes } = await this.projectService.patch(
        updateProjectDto,
        id,
      );

      const fieldsChanged =
        Object.keys(changes).length > 0
          ? `Измененные поля: ${Object.keys(changes).join(', ')}`
          : 'Нет изменений';

      return res.status(HttpStatus.OK).json({
        message: fieldsChanged,
        ...project,
      });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }

  @ApiOperation({ summary: 'Удаление проекта (архивация)' })
  @ApiResponse({
    status: 200,
    type: DeleteForProjectResponseSchema,
    description: 'Проект успешно удалён',
  })
  @ApiBadRequestResponse({
    type: DeleteProjectErrorSchema,
    description: 'Проект уже удалён',
  })
  @Delete(':id/delete')
  async softDeleteUser(@Res() res: Response, @Param('id') id: number) {
    try {
      const payload = await this.projectService.softDeleteProject(id);

      return res
        .status(HttpStatus.OK)
        .json({ message: 'Проект успешно удалён', ...payload });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }
}
