import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './createTask.dto';
import { UserEntity } from '@modules/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddResponsibleTaskDTO {
  @ApiProperty({
    example: '1',
    description: 'Уникальный идентификатор пользователя',
  })
  @IsNumber({}, { message: 'Должно быть числом' })
  userId: number;
}
