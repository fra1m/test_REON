import { ProjectModule } from '@modules/project/project.module';
import { TaskModule } from '@modules/task/task.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      // cache: true,
      isGlobal: true,
      envFilePath: `.env`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        autoLoadEntities: true,
        synchronize: true,
        logging: true,
      }),
    }),
    UserModule,
    ProjectModule,
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
