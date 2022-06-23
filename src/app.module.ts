import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ChapterModule } from './chapter/chapter.module';
import { CommentModule } from './comment/comment.module';
import { FilesModule } from './files/files.module';
import { InAppNotificationModule } from './in-app-notification/in-app-notification.module';
import { NovelModule } from './novel/novel.module';
import { NovelService } from './novel/novel.service';
import { RateModule } from './rate/rate.module';
import { NovelCronJobService } from './schedule/novel-cron-job';
import { TagSearchLogModule } from './tag-search-log/tag-search-log.module';
import { TagModule } from './tag/tag.module';
import { UsersModule } from './users/users.module';

const cookieSession = require('cookie-session');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.env.NODE_ENV}.env`,
      validationSchema: Joi.object({
        // Database configuration
        DB_NAME: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().allow(''),
        DB_DATABASE: Joi.string().required(),
        // Cookie configuration
        COOKIE_KEY: Joi.string().required(),
        // Facebook application information
        APP_ID: Joi.string().required(),
        APP_SECRET: Joi.string().required(),
        // Deployment url
        BASE_URL: Joi.string().uri(),
        // JWT configuration
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION_TIME: Joi.number().required(),
        // SMTP mail server configuration
        MAIL_SERVER_HOST: Joi.string().required(),
        MAIL_SERVER_PORT: Joi.number().required(),
        MAIL_SERVER_USERNAME: Joi.string().required(),
        MAIL_SERVER_PASSWORD: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'mysql',
          host: config.get<string>('DB_HOST'),
          port: config.get<number>('DB_PORT'),
          username: config.get<string>('DB_USERNAME'),
          database: config.get<string>('DB_DATABASE'),
          password: config.get<string>('DB_PASSWORD'),
          entities: [join(__dirname, '**', '*.entity.{ts,js}')],
          synchronize: true,
        };
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '../client'),
    }),
    UsersModule,
    AuthModule,
    FilesModule,
    CategoryModule,
    TagModule,
    NovelModule,
    ChapterModule,
    CommentModule,
    RateModule,
    InAppNotificationModule,
    TagSearchLogModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true }),
    },
    NovelCronJobService,
    NovelService
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*');
  }
}
