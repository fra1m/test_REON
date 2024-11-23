import { TaskEntity } from '@modules/task/entities/task.entity';
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
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'projects' })
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
    select: false,
  })
  updatedAt: Date;

  @ApiProperty({
    example: () => UserEntity,
    description: 'Создатель проекта',
  })
  @ManyToOne(() => UserEntity, (user) => user.projects)
  @JoinColumn({ name: 'author_id' })
  author: UserEntity;

  @DeleteDateColumn({
    type: 'timestamp',
    precision: 0,
    select: false,
    nullable: true,
  })
  deletedAt: Date | null;

  @ApiProperty({
    type: () => [UserEntity],
    description: 'Массив сотрудников у проекта',
  })
  @ManyToMany(() => UserEntity, { cascade: true, eager: true })
  @JoinTable({
    name: 'projects_users',
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
    description: 'Массив задач, связанных с проектом',
  })
  @OneToMany(() => TaskEntity, (task) => task.project, {
    cascade: true,
    eager: true,
  })
  tasks: TaskEntity[];
}
