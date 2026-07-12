import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ResumesModule } from './modules/resumes/resumes.module';
import { AnalysisModule } from './modules/analysis/analysis.module';
import { AiModule } from './modules/ai/ai.module';
import { ExportsModule } from './modules/exports/exports.module';
import { TemplatesModule } from './modules/templates/templates.module';
import { MailModule } from './modules/mail/mail.module';
import { ContactModule } from './modules/contact/contact.module';
import { StorageModule } from './modules/storage/storage.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './modules/tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_REFRESH_SECRET: Joi.string().required(),
        GEMINI_API_KEY: Joi.string().required(),
        PORT: Joi.number().default(3001),
        // SMTP (optional — email sending disabled if not set)
        SMTP_HOST: Joi.string().optional(),
        SMTP_PORT: Joi.number().default(587),
        SMTP_USER: Joi.string().optional(),
        SMTP_PASS: Joi.string().optional(),
        SMTP_FROM: Joi.string().optional(),
        // Google OAuth (optional — Google login disabled if not set)
        GOOGLE_CLIENT_ID: Joi.string().optional(),
        GOOGLE_CLIENT_SECRET: Joi.string().optional(),
        GOOGLE_CALLBACK_URL: Joi.string().optional(),
        FRONTEND_URL: Joi.string().default('http://localhost:3000'),
        // AWS S3 Storage (optional)
        S3_ENDPOINT: Joi.string().optional().allow(''),
        S3_REGION: Joi.string().optional().allow(''),
        S3_BUCKET: Joi.string().optional().allow(''),
        S3_ACCESS_KEY_ID: Joi.string().optional().allow(''),
        S3_SECRET_ACCESS_KEY: Joi.string().optional().allow(''),
      }),
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 5, // 5 requests per minute per IP for login
    }]),
    PrismaModule,
    MailModule,
    AuthModule,
    UsersModule,
    ResumesModule,
    AnalysisModule,
    AiModule,
    ExportsModule,
    TemplatesModule,
    ContactModule,
    StorageModule,
    ScheduleModule.forRoot(),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
