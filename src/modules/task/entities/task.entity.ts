import { ProjectEntity } from '@modules/project/entities/project.entity';
import { UserEntity } from '@modules/user/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'tasks' })
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
    type: () => [UserEntity],
    description: 'Ответственные за задачу',
  })
  @ManyToMany(() => UserEntity, (user) => user.tasks, {
    cascade: true,
    eager: true,
    nullable: true,
  })
  @JoinTable({
    name: 'tasks_users',
    joinColumn: {
      name: 'task_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  responsibles: UserEntity[];

  @ApiProperty({
    example: '2024-06-15 17:00:00',
    description: 'Дедлайн задачи',
  })
  @Column({
    type: 'timestamp',
    precision: 0,
    default: null,
  })
  deadline: Date | null;

  @ApiProperty({
    example: false,
    description: 'Статус задачи (true/false)',
  })
  @Column({ default: false })
  status: boolean;

  @ApiProperty({
    type: () => ProjectEntity,
    description: 'Проект, к которому относится задача',
  })
  @ManyToOne(() => ProjectEntity, (project) => project.tasks)
  @JoinColumn({ name: 'project_Id ' })
  project?: ProjectEntity;

  @DeleteDateColumn({
    type: 'timestamp',
    precision: 0,
    select: false,
    nullable: true,
  })
  deletedAt: Date | null;
}
