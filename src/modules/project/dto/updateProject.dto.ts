import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateProjectDto {
  @ApiProperty({
    example: 'TEST Project',
    description: 'Имя проекта',
  })
  @IsString({ message: 'Должно быть строкой' })
  name?: string;

  @ApiProperty({
    example: 'Это тестовый проект',
    description: 'Описание проекта',
  })
  @IsString({ message: 'Должно быть строкой' })
  description?: string;
}
