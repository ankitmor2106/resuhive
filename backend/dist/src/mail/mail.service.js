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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nodemailer = __importStar(require("nodemailer"));
let MailService = MailService_1 = class MailService {
    configService;
    logger = new common_1.Logger(MailService_1.name);
    transporter = null;
    constructor(configService) {
        this.configService = configService;
        const host = this.configService.get('SMTP_HOST');
        const port = this.configService.get('SMTP_PORT');
        const user = this.configService.get('SMTP_USER');
        const pass = this.configService.get('SMTP_PASS');
        if (host && user && pass) {
            this.transporter = nodemailer.createTransport({
                host,
                port: port || 587,
                secure: port === 465,
                auth: { user, pass },
            });
            this.logger.log('SMTP transporter configured');
        }
        else {
            this.logger.warn('SMTP credentials not configured. Email sending will be disabled. ' +
                'Set SMTP_HOST, SMTP_USER, and SMTP_PASS in your .env file.');
        }
    }
    async sendPasswordResetEmail(to, resetUrl) {
        if (!this.transporter) {
            this.logger.warn(`Password reset email to ${to} skipped — SMTP not configured`);
            this.logger.log(`Reset URL (for development): ${resetUrl}`);
            return false;
        }
        const from = this.configService.get('SMTP_FROM') || 'Resumate <noreply@resumate.app>';
        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background-color:#f3f5f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
            <div style="background:#1E4B3D;padding:32px 40px;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:600;">Resumate</h1>
            </div>
            <div style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#14181C;font-size:20px;font-weight:600;">Reset Your Password</h2>
              <p style="margin:0 0 24px;color:#555;font-size:15px;line-height:1.6;">
                We received a request to reset your password. Click the button below to create a new password. This link will expire in 1 hour.
              </p>
              <a href="${resetUrl}" style="display:inline-block;background:#1E4B3D;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;font-weight:600;">
                Reset Password
              </a>
              <p style="margin:24px 0 0;color:#888;font-size:13px;line-height:1.5;">
                If you didn't request this, you can safely ignore this email. Your password will remain unchanged.
              </p>
              <hr style="margin:32px 0;border:none;border-top:1px solid #eee;">
              <p style="margin:0;color:#aaa;font-size:12px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color:#1E4B3D;word-break:break-all;">${resetUrl}</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
        try {
            await this.transporter.sendMail({
                from,
                to,
                subject: 'Reset your Resumate password',
                html,
            });
            this.logger.log(`Password reset email sent to ${to}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send password reset email to ${to}`, error);
            return false;
        }
    }
    async sendContactNotificationEmail(data) {
        if (!this.transporter) {
            this.logger.warn(`Contact notification email skipped — SMTP not configured`);
            return false;
        }
        const from = this.configService.get('SMTP_FROM') || 'Resumate <noreply@resumate.app>';
        const to = this.configService.get('SMTP_ADMIN_EMAIL') || from;
        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
        </head>
        <body style="font-family:sans-serif;background-color:#f3f5f1;padding:40px;">
          <div style="max-width:600px;margin:0 auto;background:#fff;padding:40px;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
            <h2 style="color:#1E4B3D;margin-top:0;">New Contact Form Submission</h2>
            <p><strong>Topic:</strong> ${data.topic}</p>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <hr style="border:1px solid #eee;margin:20px 0;">
            <p style="white-space:pre-wrap;color:#555;">${data.message}</p>
          </div>
        </body>
      </html>
    `;
        try {
            await this.transporter.sendMail({
                from,
                to,
                replyTo: data.email,
                subject: `New Feedback: ${data.topic} from ${data.name}`,
                html,
            });
            this.logger.log(`Contact notification email sent to admin for ${data.name}`);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send contact notification email`, error);
            return false;
        }
    }
};
exports.MailService = MailService;
exports.MailService = MailService = MailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], MailService);
//# sourceMappingURL=mail.service.js.map