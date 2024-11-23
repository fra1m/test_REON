import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '@modules/user/entities/user.entity';

@Entity({ name: 'tokens' })
export class TokenEntity extends BaseEntity {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор токена' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'asdasd123sfafdggsxcx;',
    description: 'JWT token',
  })
  @Column({ unique: true, nullable: false })
  token: string;

  @ApiProperty({
    type: () => UserEntity, // Используем lazy resolver
    description: 'ID пользователя',
  })
  @ManyToOne(() => UserEntity, (user) => user.token, {
    cascade: true,
  })
  @JoinColumn({ name: 'userId' })
  userId: UserEntity;

  @ApiProperty({
    example: '2024-05-30 15:49:54',
    description: 'Время создания токена',
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
    description: 'Дата последнего обновления токена',
  })
  @UpdateDateColumn({
    type: 'timestamp',
    precision: 0,
    select: false,
  })
  updatedAt: Date;
}
