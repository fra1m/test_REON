import { ProjectModule } from '@modules/project/project.module';
import { RoleModule } from '@modules/role/role.module';
import { TaskModule } from '@modules/task/task.module';
import { UserModule } from '@modules/user/user.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiErrorMiddleware } from './middleware/error-middleware';

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
        // logging: true,
      }),
    }),
    UserModule,
    ProjectModule,
    TaskModule,
    RoleModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiErrorMiddleware).forRoutes('*');
  }
}
