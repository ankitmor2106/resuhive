"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let StorageService = StorageService_1 = class StorageService {
    config;
    logger = new common_1.Logger(StorageService_1.name);
    client = null;
    isConfigured = false;
    constructor(config) {
        this.config = config;
        const region = this.config.get('S3_REGION');
        const endpoint = this.config.get('S3_ENDPOINT');
        const accessKeyId = this.config.get('S3_ACCESS_KEY_ID');
        const secretAccessKey = this.config.get('S3_SECRET_ACCESS_KEY');
        if (region && accessKeyId && secretAccessKey) {
            this.client = new client_s3_1.S3Client({
                region,
                ...(endpoint ? { endpoint } : {}),
                credentials: {
                    accessKeyId,
                    secretAccessKey,
                },
            });
            this.isConfigured = true;
        }
        else {
            this.logger.warn('S3 credentials not fully configured. Cloud storage will be disabled.');
        }
    }
    isReady() {
        return this.isConfigured;
    }
    async uploadPdf(key, buffer) {
        if (!this.isConfigured || !this.client) {
            throw new common_1.InternalServerErrorException('Cloud storage is not configured.');
        }
        const bucket = this.config.get('S3_BUCKET');
        if (!bucket) {
            throw new common_1.InternalServerErrorException('S3 bucket is not configured.');
        }
        try {
            await this.client.send(new client_s3_1.PutObjectCommand({
                Bucket: bucket,
                Key: key,
                Body: buffer,
                ContentType: 'application/pdf',
            }));
            return this.getSignedDownloadUrl(key);
        }
        catch (error) {
            this.logger.error(`S3 upload failed for key=${key}`, error instanceof Error ? error.stack : undefined);
            throw new common_1.InternalServerErrorException('Failed to store the generated PDF.');
        }
    }
    async getSignedDownloadUrl(key) {
        if (!this.client)
            return '';
        const bucket = this.config.get('S3_BUCKET');
        const command = new client_s3_1.GetObjectCommand({ Bucket: bucket, Key: key });
        return (0, s3_request_presigner_1.getSignedUrl)(this.client, command, { expiresIn: 3600 });
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
//# sourceMappingURL=storage.service.js.map