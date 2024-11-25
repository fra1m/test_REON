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
  UseGuards,
  Res,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';
import { TokenEntity } from '@modules/auth/entities/token.entity';
import { AuthGuard } from '@modules/auth/jwt-auth.guard';
import { CurrentUser } from '@decorators/user-token.decorator';
import { UpdateProjectDto } from '@modules/project/dto/updateProject.dto';
import { UserEntity } from '@modules/user/entities/user.entity';
import {
  ApiOperation,
  ApiExtraModels,
  ApiResponse,
  ApiBadRequestResponse,
  ApiBody,
  ApiCookieAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import { RolesGuard } from '@modules/auth/roles.guard';
import { Roles } from '@decorators/roles-auth.decorator';
import { TaskEntity } from './entities/task.entity';
import { AddResponsibleTaskDTO } from './dto/addResponsibleTask';
import { UpdateProjectErrorSchema } from '@schemas/error-schemas';
import { UpdateTaskResponseSchema } from '@schemas/respones-schemas';

@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Cоздание задачи' })
  @ApiExtraModels(UserEntity, TaskEntity, TokenEntity, UpdateProjectDto)
  @ApiResponse({
    status: 200,
    type: UpdateTaskResponseSchema,
    description: 'Создание задачи',
  })
  @ApiBadRequestResponse({
    type: UpdateProjectErrorSchema,
    description: 'Некорректный запрос',
  })
  @ApiBody({ type: CreateTaskDto })
  @ApiCookieAuth('refreshToken')
  @ApiSecurity('AuthGuard')
  @UseGuards(AuthGuard)
  @Post('/create')
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Res() res: Response,
    @CurrentUser() user: UserEntity,
  ) {
    try {
      const payload = await this.taskService.createTask(createTaskDto, user);

      return res
        .status(HttpStatus.OK)
        .json({ message: 'Задача была создана', ...payload });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }

  @ApiOperation({ summary: 'Добавление ответственного (Администратор)' })
  @ApiExtraModels(UserEntity, TaskEntity, TokenEntity, UpdateProjectDto)
  @ApiResponse({
    status: 200,
    type: UpdateTaskResponseSchema,
    description: 'Добавление ответсвенного',
  })
  @ApiBadRequestResponse({
    type: UpdateProjectErrorSchema,
    description: 'Некорректный запрос',
  })
  @ApiBody({ type: AddResponsibleTaskDTO })
  @ApiCookieAuth('refreshToken')
  @ApiSecurity('RolesGuard')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Patch(':id/add-responsibles')
  async addResponsibles(
    @Param('id') task_Id: number,
    @Body() addResponsibleTaskDTO: AddResponsibleTaskDTO,
    @Res() res: Response,
    @CurrentUser() user: UserEntity,
  ) {
    try {
      const payload = await this.taskService.addResponsibles(
        addResponsibleTaskDTO,
        task_Id,
        user,
      );

      return res
        .status(HttpStatus.OK)
        .json({ message: 'Ответсвенный был добавлен', ...payload });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }

  @ApiOperation({ summary: 'Обновление задачи (Администратор/Ответственный)' })
  @ApiExtraModels(UserEntity, TaskEntity, TokenEntity, UpdateProjectDto)
  @ApiResponse({
    status: 200,
    type: UpdateTaskResponseSchema,
    description: 'Обновление проекта',
  })
  @ApiBadRequestResponse({
    type: UpdateProjectErrorSchema,
    description: 'Некорректный запрос',
  })
  @ApiBody({ type: UpdateTaskDto })
  @ApiCookieAuth('refreshToken')
  @ApiSecurity('AuthGuard')
  @UseGuards(AuthGuard)
  @Patch(':id/patch')
  async patch(
    @CurrentUser() user: UserEntity,
    @Param('id') task_Id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @Res() res: Response,
  ) {
    try {
      const { task, changes } = await this.taskService.patch(
        updateTaskDto,
        task_Id,
        user,
      );

      const fieldsChanged =
        Object.keys(changes).length > 0
          ? `Измененные поля: ${Object.keys(changes).join(', ')}`
          : 'Нет изменений';

      return res.status(HttpStatus.OK).json({
        message: fieldsChanged,
        task,
      });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }

  @ApiOperation({
    summary: 'Удаление задачи (архивация) (Администратор/Ответственный)',
  })
  @ApiResponse({
    status: 200,
    // type: DeleteForProjectResponseSchema,
    description: 'Задача успешно удалена',
  })
  @ApiBadRequestResponse({
    // type: DeleteProjectErrorSchema,
    description: 'Задача уже удалена',
  })
  @ApiSecurity('AuthGuard')
  @UseGuards(AuthGuard)
  @Delete(':id/delete')
  async softDeleteUser(
    @Res() res: Response,
    @Param('id') id: number,
    @CurrentUser() user: UserEntity,
  ) {
    try {
      const payload = await this.taskService.softDeleteTask(id, user);

      return res
        .status(HttpStatus.OK)
        .json({ message: 'Задача успешно удалена', ...payload });
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }
  }
}
