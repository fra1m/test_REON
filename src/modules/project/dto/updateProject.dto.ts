import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProjectDto {
  @ApiProperty({
    example: 'TEST Project',
    description: 'Имя проекта',
  })
  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  name?: string;

  @ApiProperty({
    example: 'Это тестовый проект',
    description: 'Описание проекта',
  })
  @IsOptional()
  @IsString({ message: 'Должно быть строкой' })
  description?: string;
}
