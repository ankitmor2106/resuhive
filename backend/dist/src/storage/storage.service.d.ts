import { ConfigService } from '@nestjs/config';
export declare class StorageService {
    private readonly config;
    private readonly logger;
    private client;
    private isConfigured;
    constructor(config: ConfigService);
    isReady(): boolean;
    uploadPdf(key: string, buffer: Buffer): Promise<string>;
    private getSignedDownloadUrl;
}
