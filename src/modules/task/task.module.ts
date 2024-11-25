import { forwardRef, Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TaskEntity } from './entities/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
import { ProjectModule } from '@modules/project/project.module';
import { RoleModule } from '@modules/role/role.module';

@Module({
  imports: [
    ProjectModule,
    UserModule,
    AuthModule,
    TypeOrmModule.forFeature([TaskEntity]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
