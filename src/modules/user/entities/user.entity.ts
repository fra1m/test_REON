import { ApiProperty } from '@nestjs/swagger';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RoleEntity } from './role.entity';
import { ProjectEntity } from '@modules/project/entities/project.entity';

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
    type: () => [ProjectEntity],
    description: 'Массив созданных проектов',
  })
  @OneToMany(() => ProjectEntity, (project) => project.author, {
    cascade: true,
    eager: true,
  })
  project: ProjectEntity[];

  @ApiProperty({
    type: () => [RoleEntity],
    description: 'Роли, назначенные пользователю',
  })
  @ManyToMany(() => RoleEntity, { cascade: true })
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
