
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class AddUserForProjectDto {
  @ApiProperty({
    example: '1',
    description: 'Уникальный идентификатор пользователя',
  })
  @IsNumber({}, { message: 'Должно быть числом' })
  userId: number;
}
