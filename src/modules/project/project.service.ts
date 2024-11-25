import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProjectDto } from './dto/createProject.dto';
import { UpdateProjectDto } from './dto/updateProject.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/project.entity';
import { Repository } from 'typeorm';
import { AuthService } from '@modules/auth/auth.service';
import { UserService } from '@modules/user/user.service';
import { UserForProjectDto } from './dto/addUserForProject.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async createProject(createProjectDto: CreateProjectDto) {
    const project = await this.projectRepository.save(createProjectDto);

    return { project };
  }

  async getProjectById(id: number) {
    if (!id) {
      return null;
    }

    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['users', 'author'],
    });
    if (!project) {
      throw new HttpException(
        'Проект не найден или удален',
        HttpStatus.BAD_REQUEST,
      );
    }

    return project;
  }

  async filterProject(id: number) {
    if (!id) return null;

    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['users', 'author', 'tasks', 'tasks.responsibles'],
    });

    if (!project) {
      throw new HttpException(
        'Проект не найден или удален',
        HttpStatus.BAD_REQUEST,
      );
    }

    const { password, ...author } = project.author;
    const users = project.users.map(({ password, ...rest }) => rest);
    const tasks = project.tasks.map((task) => ({
      ...task,
      responsibles: task.responsibles.map(({ password, ...rest }) => rest),
    }));

    return {
      ...project,
      author,
      users: project.users.length > 0 ? users : [],
      tasks: project.tasks.length > 0 ? tasks : [],
    };
  }

  async addUserForProject(
    addUserForProjectDto: UserForProjectDto,
    project_id: number,
  ) {
    const project = await this.getProjectById(project_id);

    if (
      project.users.some((user: any) => user.id === addUserForProjectDto.userId)
    ) {
      throw new HttpException(
        'Пользователь уже добавлен',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userService.getUserById(
      addUserForProjectDto.userId,
    );

    await this.projectRepository
      .createQueryBuilder()
      .relation(ProjectEntity, 'users')
      .of(project)
      .add(user);

    const updatedProject = await this.filterProject(project_id);
    return { project: updatedProject };
  }

  async removeUserForProject(
    removeUserForProjectDto: UserForProjectDto,
    project_id: number,
  ) {
    const project = await this.getProjectById(project_id);

    if (
      !project.users.some(
        (user: any) => user.id === removeUserForProjectDto.userId,
      )
    ) {
      throw new HttpException(
        'Пользователь уже удален',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userService.getUserById(
      removeUserForProjectDto.userId,
    );

    await this.projectRepository
      .createQueryBuilder()
      .relation(ProjectEntity, 'users')
      .of(project)
      .remove(user);

    const updatedProject = await this.filterProject(project_id);

    return { project: updatedProject };
  }

  async patch(updateProjectDto: UpdateProjectDto, project_id: number) {
    const project = await this.getProjectById(project_id);

    const changes: Record<string, { oldValue: string; newValue: string }> = {};

    for (const [key, value] of Object.entries(updateProjectDto)) {
      if (value !== undefined && project[key] !== value) {
        changes[key] = { oldValue: project[key], newValue: value };
        project[key] = value;
      }
    }

    await this.projectRepository
      .createQueryBuilder()
      .update()
      .set(updateProjectDto)
      .where('id = :id', { id: project_id })
      .execute();

    const updatedProject = await this.filterProject(project_id);
    return { project: updatedProject, changes };
  }

  async softDeleteProject(projectId: number) {
    const project = await this.filterProject(projectId);
    await this.projectRepository.softDelete(project.id);
    return { project };
  }
}
