import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'USER', description: 'Значение ролей' })
  @IsString({ message: 'Должно быть строкой' })
  value: string;

  @ApiProperty({ example: 'Сотрудник', description: 'Описание значения' })
  @IsString({ message: 'Должно быть строкой' })
  description: string;
}
