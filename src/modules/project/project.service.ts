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

    const tokens = await this.authService.generateToken(
      createProjectDto.author,
    );

    await this.authService.saveToken(
      createProjectDto.author,
      tokens.refreshToken,
    );

    return { project, tokens };
  }

  async getProjectById(id: number) {
    if (!id) {
      return null;
    }

    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    if (!project) {
      throw new HttpException('Проект не найден', HttpStatus.BAD_REQUEST);
    }

    return project;
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

    project.users.push(user);
    await this.projectRepository.save(project);

    return { project, user };
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

    project.users = project.users.filter(
      (user) => user.id !== removeUserForProjectDto.userId,
    );

    await this.projectRepository.save(project);

    return { project, user };
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
    await this.projectRepository.save(project);

    return { project, changes };
  }

  async softDeleteProject(projectId: number) {
    const project = await this.getProjectById(projectId);
    await this.projectRepository.softDelete(project.id);
    return { project };
  }
}
