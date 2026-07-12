"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Joi = __importStar(require("joi"));
const throttler_1 = require("@nestjs/throttler");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const resumes_module_1 = require("./modules/resumes/resumes.module");
const analysis_module_1 = require("./modules/analysis/analysis.module");
const ai_module_1 = require("./modules/ai/ai.module");
const exports_module_1 = require("./modules/exports/exports.module");
const templates_module_1 = require("./modules/templates/templates.module");
const mail_module_1 = require("./modules/mail/mail.module");
const contact_module_1 = require("./modules/contact/contact.module");
const storage_module_1 = require("./modules/storage/storage.module");
const schedule_1 = require("@nestjs/schedule");
const tasks_module_1 = require("./modules/tasks/tasks.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validationSchema: Joi.object({
                    DATABASE_URL: Joi.string().required(),
                    JWT_SECRET: Joi.string().required(),
                    JWT_REFRESH_SECRET: Joi.string().required(),
                    GEMINI_API_KEY: Joi.string().required(),
                    PORT: Joi.number().default(3001),
                    SMTP_HOST: Joi.string().optional(),
                    SMTP_PORT: Joi.number().default(587),
                    SMTP_USER: Joi.string().optional(),
                    SMTP_PASS: Joi.string().optional(),
                    SMTP_FROM: Joi.string().optional(),
                    GOOGLE_CLIENT_ID: Joi.string().optional(),
                    GOOGLE_CLIENT_SECRET: Joi.string().optional(),
                    GOOGLE_CALLBACK_URL: Joi.string().optional(),
                    FRONTEND_URL: Joi.string().default('http://localhost:3000'),
                    S3_ENDPOINT: Joi.string().optional().allow(''),
                    S3_REGION: Joi.string().optional().allow(''),
                    S3_BUCKET: Joi.string().optional().allow(''),
                    S3_ACCESS_KEY_ID: Joi.string().optional().allow(''),
                    S3_SECRET_ACCESS_KEY: Joi.string().optional().allow(''),
                }),
            }),
            throttler_1.ThrottlerModule.forRoot([{
                    ttl: 60000,
                    limit: 5,
                }]),
            prisma_module_1.PrismaModule,
            mail_module_1.MailModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            resumes_module_1.ResumesModule,
            analysis_module_1.AnalysisModule,
            ai_module_1.AiModule,
            exports_module_1.ExportsModule,
            templates_module_1.TemplatesModule,
            contact_module_1.ContactModule,
            storage_module_1.StorageModule,
            schedule_1.ScheduleModule.forRoot(),
            tasks_module_1.TasksModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map