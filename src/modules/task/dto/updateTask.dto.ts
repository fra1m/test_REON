import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './createTask.dto';
import { UserEntity } from '@modules/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({
    example: '2024-07-15 17:00:00',
    description: 'Дедлайн задачи',
  })
  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  deadline?: string;

  @ApiProperty({
    example: false,
    description: 'Статус задачи (true/false)',
  })
  @IsOptional()
  @IsBoolean({ message: 'Должно быть булевым значением' })
  status?: boolean;

  @ApiProperty({
    example: 1,
    description:
      'Уникальный идентификатор проекта, к которому относится задача',
  })
  @IsOptional()
  @IsNumber({}, { message: 'Должно быть числом' })
  project_id?: number;
}
