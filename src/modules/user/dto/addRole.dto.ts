import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddRoleDto {
  @ApiProperty({ example: 'USER', description: 'Роль' })
  @IsString({ message: 'Должно быть строкой' })
  value: string;

  @ApiProperty({
    example: '1',
    description: 'Уникальный идентификатор пользователя',
  })
  @IsNumber({}, { message: 'Должно быть числом' })
  userId: number;
}
