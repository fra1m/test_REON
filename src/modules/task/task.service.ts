import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/createTask.dto';
import { UpdateTaskDto } from './dto/updateTask.dto';
import { TaskEntity } from './entities/task.entity';
import { ProjectEntity } from '@modules/project/entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from '@modules/user/user.service';
import { UserEntity } from '@modules/user/entities/user.entity';
import { ProjectService } from '@modules/project/project.service';
import { AddResponsibleTaskDTO } from './dto/addResponsibleTask';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepository: Repository<TaskEntity>,
    private userService: UserService,
    private projectService: ProjectService,
  ) {}

  private async getTaskByID(id: number) {
    if (!id) {
      throw new HttpException('Задача не найдена', HttpStatus.BAD_REQUEST);
    }

    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['responsibles', 'project'],
    });
    if (!task) {
      throw new HttpException(
        'Задача не найдена или удалена',
        HttpStatus.BAD_REQUEST,
      );
    }

    return task;
  }

  private async filteredTask(id: number) {
    if (!id) {
      throw new HttpException(
        'Задача не найдена или удалена',
        HttpStatus.BAD_REQUEST,
      );
    }

    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['responsibles', 'project'],
    });
    if (!task) {
      throw new HttpException('Задача не найден', HttpStatus.BAD_REQUEST);
    }
    const responsibles = task.responsibles.map(({ password, ...rest }) => rest);
    if (task.project) {
      const users = task.project.users.map(({ password, ...rest }) => rest);
      return {
        ...task,
        responsibles,
        project: {
          ...task.project,
          users,
        },
      };
    } else return { ...task, responsibles };
  }

  private async hasUpdatePermission(
    user: UserEntity,
    task: TaskEntity,
  ): Promise<boolean> {
    const user$ = await this.userService.getUserById(user.id);

    if (user$.roles.some((role: any) => role.value === 'ADMIN')) {
      return true;
    }
    return task.responsibles.some(
      (responsible: UserEntity) => responsible.id === user$.id,
    );
  }

  async createTask(createTaskDto: CreateTaskDto, user: UserEntity) {
    const project = await this.taskRepository.manager.findOne(ProjectEntity, {
      where: { id: createTaskDto.project_id },
      relations: ['tasks'],
    });

    if (!project) {
      throw new HttpException(
        'Проект не существует или удален',
        HttpStatus.BAD_REQUEST,
      );
    }

    const task = await this.taskRepository.save({
      ...createTaskDto,
      deadline: createTaskDto.deadline
        ? new Date(createTaskDto.deadline)
        : null,

      project,
    });

    await this.taskRepository
      .createQueryBuilder()
      .relation(TaskEntity, 'responsibles')
      .of(task)
      .add(user);

    const updatedTask = await this.filteredTask(task.id);

    return { task: updatedTask };
  }

  async addResponsibles(
    addResponsibleTaskDTO: AddResponsibleTaskDTO,
    task_Id: number,
    user: UserEntity,
  ) {
    const task = await this.getTaskByID(task_Id);
    const responsible = await this.userService.getUserById(
      addResponsibleTaskDTO.userId,
    );
    const user$ = await this.userService.getUserById(user.id);
    if (!user$.roles.some((role) => role.value === 'ADMIN')) {
      throw new HttpException('У вас нет доступа!', HttpStatus.FORBIDDEN);
    }

    const hasPermission = this.hasUpdatePermission(user$, task);
    if (!hasPermission) {
      throw new HttpException('У вас нет доступа!', HttpStatus.FORBIDDEN);
    }

    if (task.responsibles.some((user: any) => user.id === responsible.id)) {
      throw new HttpException(
        'Этот ответственный уже добавлен',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.taskRepository
      .createQueryBuilder()
      .relation(TaskEntity, 'responsibles')
      .of(task)
      .add(responsible);

    const updatedTask = await this.filteredTask(task_Id);

    return { task: updatedTask };
  }

  async patch(updateTaskDto: UpdateTaskDto, task_Id: number, user: UserEntity) {
    const task = await this.getTaskByID(task_Id);

    const hasPermission = await this.hasUpdatePermission(user, task);
    const changes: Record<
      string,
      { oldValue: string; newValue: string | boolean | UserEntity }
    > = {};

    if (!hasPermission) {
      throw new HttpException('У вас нет доступа!', HttpStatus.FORBIDDEN);
    }

    const { project_id, ...taskDto } = updateTaskDto;

    const project = await this.projectService.getProjectById(
      updateTaskDto.project_id,
    );

    for (const [key, value] of Object.entries(taskDto)) {
      if (value !== undefined && task[key] !== value) {
        changes[key] = { oldValue: task[key], newValue: value };
        task[key] = value;
      }
    }
    task.project = project;
    await this.taskRepository.save(task);
    const updatedTask = await this.filteredTask(task_Id);

    return { task: updatedTask, changes };
  }

  async softDeleteTask(task_Id: number, user: UserEntity) {
    const task = await this.getTaskByID(task_Id);
    const hasPermission = await this.hasUpdatePermission(user, task);
    if (!hasPermission) {
      throw new HttpException('У вас нет доступа!', HttpStatus.FORBIDDEN);
    }
    const updatedTask = await this.filteredTask(task_Id);

    await this.taskRepository.softDelete(task_Id);
    return { task: updatedTask };
  }
}
