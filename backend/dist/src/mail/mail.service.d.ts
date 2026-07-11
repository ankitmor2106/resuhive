import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private readonly configService;
    private readonly logger;
    private transporter;
    constructor(configService: ConfigService);
    sendPasswordResetEmail(to: string, resetUrl: string): Promise<boolean>;
    sendContactNotificationEmail(data: {
        name: string;
        email: string;
        topic: string;
        message: string;
    }): Promise<boolean>;
}
