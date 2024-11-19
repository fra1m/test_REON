import { TaskEntity } from '@modules/task/entities/task.entity';
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
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'project' })
export class ProjectEntity extends BaseEntity {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'TEST Project',
    description: 'Имя проекта',
  })
  @Column()
  name: string;

  @ApiProperty({
    example: 'Это тестовый проект',
    description: 'Описание проекта',
  })
  @Column()
  description: string;

  @ApiProperty({
    example: '2024-05-30 15:49:54',
    description: 'Дата создания проекта',
  })
  @CreateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-06-01 10:30:00',
    description: 'Дата последнего обновления проекта',
  })
  @UpdateDateColumn({
    type: 'timestamp',
    precision: 0,
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
  })
  updatedAt: Date;

  @ApiProperty({
    type: () => UserEntity,
    description: 'Создатель проекта',
  })
  @ManyToOne(() => UserEntity, (user) => user.project)
  @JoinColumn({ name: 'user_id' })
  author: UserEntity;

  @ApiProperty({
    type: () => [UserEntity],
    description: 'Множество сотрудников у проекта',
  })
  @ManyToMany(() => UserEntity, { cascade: true })
  @JoinTable({
    name: 'project_users', 
    joinColumn: {
      name: 'project_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: UserEntity[];

  @ApiProperty({
    type: () => [TaskEntity],
    description: 'Список задач, связанных с проектом',
  })
  @OneToMany(() => TaskEntity, (task) => task.project, {
    cascade: true,
    eager: true,
  })
  task: TaskEntity[];
}
