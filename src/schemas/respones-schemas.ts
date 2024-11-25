import { TokenEntity } from '@modules/auth/entities/token.entity';
import { ProjectEntity } from '@modules/project/entities/project.entity';
import { RoleEntity } from '@modules/role/entities/role.entity';
import { TaskEntity } from '@modules/task/entities/task.entity';
import { RemoveRoleDto } from '@modules/user/dto/updateUser.dto';
import { UserEntity } from '@modules/user/entities/user.entity';
import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';

class Tokens {
  @ApiProperty({
    type: String,
    description: 'Access токен',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accesToken: string;

  @ApiProperty({
    type: String,
    description: 'Refresh токен',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;
}

class UserWithoutPrivateFields extends OmitType(UserEntity, [
  'password',
  'token',
  'projects',
] as const) {}

class CreateProjectWithoutRelations extends OmitType(ProjectEntity, [
  'users',
  'tasks',
] as const) {}

class RemoveUserForProjectWithoutRelations extends OmitType(ProjectEntity, [
  'tasks',
  'author',
] as const) {}

class uu extends OmitType(TaskEntity, []) {}

class RemoveRoleSchema {
  @ApiProperty({
    type: 'string',
    example: 'Роль у пользователя успешно удалена!',
    description: 'Сообщение о результате операции',
  })
  message: string;

  @ApiProperty({
    type: UserWithoutPrivateFields,
    description: 'Информация о пользователе (без пароля и приватных полей)',
  })
  user: UserEntity;

  @ApiProperty({
    type: Tokens,
    description: 'Объект, содержащий токены (access и refresh)',
  })
  tokens: Tokens;
}

class RegistrationResponseSchema {
  @ApiProperty({
    type: 'string',
    example: 'Регистрация прошла успешно, вы можете приступить к работе!',
    description: 'Сообщение о результате операции',
  })
  message: string;

  @ApiProperty({
    type: OmitType(UserEntity, ['password', 'token', 'projects'] as const),
    description: 'Информация о пользователе (без пароля и приватных полей)',
  })
  user: UserEntity;

  @ApiProperty({
    type: Tokens,
    description: 'Объект, содержащий токены (access и refresh)',
  })
  tokens: Tokens;
}

class AuthResponseSchema {
  @ApiProperty({
    type: 'string',
    example: 'Позздравляю, вы можете приступить к работе!',
    description: 'Сообщение о результате операции',
  })
  message: string;

  @ApiProperty({
    type: UserWithoutPrivateFields,
    description: 'Информация о пользователе (без пароля и приватных полей)',
  })
  user: UserEntity;

  @ApiProperty({
    type: Tokens,
    description: 'Объект, содержащий токены (access и refresh)',
  })
  tokens: Tokens;
}

class RefreshTokenResponseSchema extends AuthResponseSchema {}

class DeleteUserResponseSchema {
  @ApiProperty({
    type: 'string',
    example: 'Пользователь успешно удален',
    description: 'Сообщение об успешном удаление пользователя',
  })
  message: string;

  @ApiProperty({
    type: UserWithoutPrivateFields,
    description: 'Информация о пользователе (без пароля и приватных полей)',
  })
  user: UserEntity;
}

class CreateRoleResponseSchema {
  @ApiProperty({
    type: 'string',
    example: 'Роль была создана',
    description: 'Сообщение о результате операции',
  })
  message: string;

  @ApiProperty({
    type: () => RoleEntity,
    description: 'Сущность роль',
  })
  roles: RoleEntity;
}

class AddRoleResponseSchema {
  @ApiProperty({
    type: 'string',
    example: 'Роль была добавлена пользователю успешно!',
    description: 'Сообщение о результате операции',
  })
  message: string;

  @ApiProperty({
    type: UserWithoutPrivateFields,
    description: 'Информация о пользователе (без пароля и приватных полей)',
  })
  user: UserEntity;

  @ApiProperty({
    type: Tokens,
    description: 'Объект, содержащий токены (access и refresh)',
  })
  tokens: Tokens;
}

class GetRolesResponseSchema {
  @ApiProperty({
    type: 'string',
    example: 'Все существующие роли были супешно получены!',
    description: 'Сообщение о результате операции',
  })
  message: string;

  @ApiProperty({
    type: () => [RoleEntity],
    description: 'Массив существующих ролей',
  })
  roles: RoleEntity[];
}

class CreateProjectResponseSchema {
  @ApiProperty({
    type: 'string',
    example: 'Проект был создан',
    description: 'Сообщение о результате операции',
  })
  message: string;

  @ApiProperty({
    type: CreateProjectWithoutRelations,
    description: 'Сущность проект',
  })
  project: ProjectEntity;
}

class AddUserForProjectResponseSchema {
  @ApiProperty({
    type: 'string',
    example: 'Пользователь успешно добавлен к задаче',
    description: 'Сообщение о результате операции',
  })
  message: string;

  @ApiProperty({
    type: CreateProjectWithoutRelations,
    description: 'Сущность проект',
  })
  project: ProjectEntity;

  @ApiProperty({
    type: UserWithoutPrivateFields,
    description: 'Информация о пользователе (без пароля и приватных полей)',
  })
  user: UserEntity;
}

class RemoveUserForProjectResponseSchema {
  @ApiProperty({
    type: 'string',
    example: 'Пользователь успешно удален',
    description: 'Сообщение о результате операции',
  })
  message: string;

  @ApiProperty({
    type: RemoveUserForProjectWithoutRelations,
    description: 'Сущность проект',
  })
  project: ProjectEntity;

  @ApiProperty({
    type: UserWithoutPrivateFields,
    description: 'Информация о пользователе (без пароля и приватных полей)',
  })
  user: UserEntity;
}

class DeleteForProjectResponseSchema {
  @ApiProperty({
    type: 'string',
    example: 'Проект успешно удален',
    description: 'Сообщение о результате операции',
  })
  message: string;

  @ApiProperty({
    type: RemoveUserForProjectWithoutRelations,
    description: 'Сущность проект',
  })
  project: ProjectEntity;
}

class UpdateProjectResponseSchema {
  @ApiProperty({
    type: 'string',
    example: 'Измененные поля: name, description',
    description: 'Сообщение о результате операции',
  })
  message: string;

  @ApiProperty({
    type: CreateProjectWithoutRelations,
    description: 'Сущность проект',
  })
  project: ProjectEntity;
}

class UpdateTaskResponseSchema {
  @ApiProperty({
    type: 'string',
    example: 'Измененные поля: name, description, status, project_id',
    description: 'Сообщение о результате операции',
  })
  message: string;

  @ApiProperty({
    type: TaskEntity,
    description: 'Сущность задача',
  })
  task: TaskEntity;
}

export {
  AuthResponseSchema,
  RegistrationResponseSchema,
  CreateRoleResponseSchema,
  AddRoleResponseSchema,
  GetRolesResponseSchema,
  DeleteUserResponseSchema,
  RefreshTokenResponseSchema,
  CreateProjectResponseSchema,
  AddUserForProjectResponseSchema,
  RemoveUserForProjectResponseSchema,
  UpdateProjectResponseSchema,
  DeleteForProjectResponseSchema,
  RemoveRoleSchema,
  UpdateTaskResponseSchema,
};
