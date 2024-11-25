import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleEntity } from '../../role/entities/role.entity';
import { ProjectEntity } from '@modules/project/entities/project.entity';
import { TokenEntity } from '@modules/auth/entities/token.entity';
import { TaskEntity } from '@modules/task/entities/task.entity';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'TestDeveloper',
    description: 'Имя пользователя',
  })
  @Column()
  name: string;

  @ApiProperty({
    example: `user_${Math.random().toString(36).substring(7)}@example.com`,
    description: 'Почта пользователя',
  })
  @Column({ unique: true, nullable: false })
  email: string;

  @ApiProperty({
    example: 'pass123',
    description: 'Пароль пользователя',
    minLength: 6,
    maxLength: 16,
  })
  @Column()
  password: string;

  @DeleteDateColumn({
    type: 'timestamp',
    precision: 0,
    select: false,
    nullable: true,
  })
  deletedAt: Date | null;

  @ApiProperty({
    type: () => [TokenEntity],
    description: 'Массив токенов пользователя',
  })
  @OneToMany(() => TokenEntity, (token) => token.userId)
  token: TokenEntity[];

  @ApiProperty({
    type: () => [ProjectEntity],
    description: 'Массив созданных проектов',
  })
  @OneToMany(() => ProjectEntity, (projects) => projects.author, {
    cascade: true,
  })
  projects: ProjectEntity[];

  @ManyToMany(() => TaskEntity, (task) => task.responsibles)
  tasks: TaskEntity[];

  @ApiProperty({
    type: () => [RoleEntity],
    description: 'Роли, назначенные пользователю',
  })
  @ManyToMany(() => RoleEntity, { cascade: true, eager: true })
  @JoinTable({
    name: 'user_roles',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
  })
  roles: RoleEntity[];
}
