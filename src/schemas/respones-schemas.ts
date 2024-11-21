import { TokenEntity } from '@modules/auth/entities/token.entity';
import { RoleEntity } from '@modules/role/entities/role.entity';
import { UserEntity } from '@modules/user/entities/user.entity';
import { ApiProperty, OmitType, PickType } from '@nestjs/swagger';

export class Tokens {
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

class RegistrationResponseSchema {
  @ApiProperty({
    type: 'string',
    example: 'Регистрация прошла успешно, вы можете приступить к работе!',
    description: 'Сообщение о результате операции',
  })
  message: string;

  @ApiProperty({
    type: OmitType(UserEntity, ['password', 'token', 'project'] as const),
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
    example: 'Авторизация прошла успешно, вы можете приступить к работе!',
    description: 'Сообщение о результате операции',
  })
  message: string;

  @ApiProperty({
    type: OmitType(UserEntity, ['password', 'token'] as const),
    description: 'Информация о пользователе (без пароля и приватных полей)',
  })
  user: UserEntity;

  @ApiProperty({
    type: Tokens,
    description: 'Объект, содержащий токены (access и refresh)',
  })
  tokens: Tokens;
}

class DeleteUserResponseSchema {
  @ApiProperty({
    type: 'string',
    example: 'Пользователь успешно удален',
    description: 'Сообщение об успешном удаление пользователя',
  })
  message: string;

  @ApiProperty({
    type: OmitType(UserEntity, ['password', 'token'] as const),
    description: 'Информация о пользователе (без пароля и приватных полей)',
  })
  user: UserEntity;
}

class CreateRoleResponseSchema {
  @ApiProperty({ example: 'ADMIN', description: 'Значение ролей' })
  value: string;

  @ApiProperty({ example: 'Роль админ', description: 'Описание значения' })
  description: string;
}
class AddRoleResponseSchema {
  @ApiProperty({
    type: 'string',
    example: 'Роль была добавлена пользователю успешно!',
    description: 'Сообщение о результате операции',
  })
  message: string;

  @ApiProperty({
    type: OmitType(UserEntity, ['password', 'token'] as const),
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

export {
  AuthResponseSchema,
  RegistrationResponseSchema,
  CreateRoleResponseSchema,
  AddRoleResponseSchema,
  GetRolesResponseSchema,
  DeleteUserResponseSchema,
};
