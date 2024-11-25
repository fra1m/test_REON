import { UserEntity } from '@modules/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty({
    example: 'TEST Task',
    description: 'Имя задачи',
  })
  @IsString({ message: 'Должно быть строкой' })
  name: string;

  @ApiProperty({
    example: 'Это тестовый задача',
    description: 'Описание задачи',
  })
  @IsString({ message: 'Должно быть строкой' })
  description: string;

  @ApiProperty({
    example: 1,
    description:
      'Уникальный идентификатор проекта, к которому относится задача',
  })
  @IsNumber({}, { message: 'Должно быть числом' })
  project_id: number;

  @ApiProperty({
    example: '2024-07-15 17:00:00',
    description: 'Дедлайн задачи',
  })
  @IsOptional()
  deadline: string;
}
