import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'roles' })
export class RoleEntity extends BaseEntity {
  @ApiProperty({ example: '1', description: 'Уникальный идификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'USER',
    description: 'Уникальное значение роли',
  })
  @Column({ unique: true })
  value: string;

  @ApiProperty({
    example: 'Сотрудник',
    description: 'Описание роли',
  })
  @Column()
  description: string;
}
