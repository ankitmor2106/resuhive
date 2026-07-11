import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private client: S3Client | null = null;
  private isConfigured = false;

  constructor(private readonly config: ConfigService) {
    const region = this.config.get<string>('S3_REGION');
    const endpoint = this.config.get<string>('S3_ENDPOINT');
    const accessKeyId = this.config.get<string>('S3_ACCESS_KEY_ID');
    const secretAccessKey = this.config.get<string>('S3_SECRET_ACCESS_KEY');

    if (region && accessKeyId && secretAccessKey) {
      this.client = new S3Client({
        region,
        ...(endpoint ? { endpoint } : {}),
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
      this.isConfigured = true;
    } else {
      this.logger.warn('S3 credentials not fully configured. Cloud storage will be disabled.');
    }
  }

  isReady(): boolean {
    return this.isConfigured;
  }

  async uploadPdf(key: string, buffer: Buffer): Promise<string> {
    if (!this.isConfigured || !this.client) {
      throw new InternalServerErrorException('Cloud storage is not configured.');
    }

    const bucket = this.config.get<string>('S3_BUCKET');
    if (!bucket) {
      throw new InternalServerErrorException('S3 bucket is not configured.');
    }

    try {
      await this.client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: buffer,
          ContentType: 'application/pdf',
        }),
      );
      return this.getSignedDownloadUrl(key);
    } catch (error) {
      this.logger.error(
        `S3 upload failed for key=${key}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException('Failed to store the generated PDF.');
    }
  }

  private async getSignedDownloadUrl(key: string): Promise<string> {
    if (!this.client) return '';
    const bucket = this.config.get<string>('S3_BUCKET');
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    return getSignedUrl(this.client, command, { expiresIn: 3600 });
  }
}
