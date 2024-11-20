import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({ example: 'ADMIN', description: 'Значение ролей' })
  value: string;

  @ApiProperty({ example: 'Роль админ', description: 'Описание значения' })
  description: string;
}
