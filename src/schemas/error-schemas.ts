import { ApiProperty } from '@nestjs/swagger';

class RegistrationErrorSchema {
  @ApiProperty({
    type: 'string',
    example: 'Пользователь с таким email существует!',
    description: 'Сообщение об ошибке при регистрации',
  })
  message: string;
}

class AuthErrorSchema {
  @ApiProperty({
    type: 'string',
    example: 'Пользователь с таким email не существует',
    description: 'Сообщение об ошибке при авторизации',
  })
  message: string;
}

class DeleteUserErrorSchema {
  @ApiProperty({
    type: 'string',
    example: 'Пользователь уже удален',
    description: 'Сообщение об ошибке при удаление пользователя',
  })
  message: string;
}

class CreateRoleErrorSchema {
  @ApiProperty({
    type: 'string',
    example: 'Роль ADMIN уже существует!',
    description: 'Сообщение об ошибке при регистрации',
  })
  message: string;
}

class AddRoleErrorSchema {
  @ApiProperty({
    type: 'string',
    example: 'У пользователя уже есть роль USER',
    description: 'Сообщение об ошибке добавление роли',
  })
  message: string;
}

class GetRolesErrorSchema {
  @ApiProperty({
    type: 'string',
    example: 'У вас нет доступа!',
    description: 'Сообщение об ошибке при получение списка всех ролей',
  })
  message: string;
}

class CreateProjectErrorSchema {
  @ApiProperty({
    type: 'string',
    example: 'У вас нет доступа!',
    description: 'Сообщение об ошибке при создании проекта',
  })
  message: string;
}

class AddUserForProjectErrorSchema {
  @ApiProperty({
    type: 'string',
    example: 'У вас нет доступа!',
    description: 'Сообщение об ошибке при добавление пользователя в проект',
  })
  message: string;
}

class RemoveUserForProjectErrorSchema {
  @ApiProperty({
    type: 'string',
    example: 'Пользователь уже удален',
    description: 'Сообщение об ошибке при удаление пользователя в проект',
  })
  message: string;
}

class UpdateProjectErrorSchema {
  @ApiProperty({
    type: 'string',
    example: 'У вас нет доступа!',
    description: 'Сообщение об ошибке при изменении проекта',
  })
  message: string;
}

class DeleteProjectErrorSchema {
  @ApiProperty({
    type: 'string',
    example: 'Проект не найден',
    description: 'Сообщение об ошибке при изменении проекта',
  })
  message: string;
}

export {
  AuthErrorSchema,
  AddRoleErrorSchema,
  GetRolesErrorSchema,
  RegistrationErrorSchema,
  CreateRoleErrorSchema,
  DeleteUserErrorSchema,
  CreateProjectErrorSchema,
  AddUserForProjectErrorSchema,
  RemoveUserForProjectErrorSchema,
  UpdateProjectErrorSchema,
  DeleteProjectErrorSchema,
};
