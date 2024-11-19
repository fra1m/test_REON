import { ProjectEntity } from '@modules/project/entities/project.entity';
import { UserEntity } from '@modules/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'task' })
export class TaskEntity extends BaseEntity {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'TEST task',
    description: 'Имя задачи',
  })
  @Column()
  name: string;

  @ApiProperty({
    example: 'Это тестовая задача',
    description: 'Описание задачи',
  })
  @Column()
  description: string;

  @ApiProperty({
    example: UserEntity,
    description: 'Ответсвенный задачи',
  })
  @ManyToMany(() => UserEntity)
  @JoinTable({
    name: 'task_users',
    joinColumn: {
      name: 'task_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  responsible: UserEntity[];

  @ApiProperty({
    example: '2024-06-15 17:00:00',
    description: 'Дедлайн задачи',
  })
  @Column({ type: 'timestamp', nullable: true })
  deadline: Date;

  @ApiProperty({
    example: false,
    description: 'Статус задачи (true/false)',
  })
  @Column()
  status: boolean;

  @ApiProperty({
    type: () => ProjectEntity,
    description: 'Проект, к которому относится задача',
  })
  @ManyToOne(() => ProjectEntity, (project) => project.task)
  project: ProjectEntity;
}
