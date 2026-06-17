import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private s3Client: S3Client | null = null;
  private bucketName: string;
  private publicUrl: string;
  private isMockMode = false;

  constructor(private configService: ConfigService) {
    const accountId = this.configService.get<string>('R2_ACCOUNT_ID');
    const accessKeyId = this.configService.get<string>('R2_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>(
      'R2_SECRET_ACCESS_KEY',
    );
    this.bucketName =
      this.configService.get<string>('R2_BUCKET_NAME') || 'quickmate-media';
    this.publicUrl =
      this.configService.get<string>('R2_PUBLIC_URL') ||
      'https://pub-quickmate-media.com';

    // If credentials are missing or set to placeholder/dummy values, run in mock mode
    if (
      !accountId ||
      !accessKeyId ||
      !secretAccessKey ||
      accessKeyId.includes('dummy') ||
      secretAccessKey.includes('dummy') ||
      accountId.includes('dummy')
    ) {
      this.isMockMode = true;
      this.logger.warn(
        'Cloudflare R2 credentials missing or dummy. Operating in MOCK STORAGE mode.',
      );
    } else {
      this.s3Client = new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });
    }
  }

  /**
   * Generates a presigned upload URL (PUT method) for direct client uploads,
   * along with the final public CDN read URL.
   */
  async getPresignedUploadUrl(filename: string, contentType: string) {
    const uniqueFilename = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 8)}-${filename}`;
    const objectKey = `uploads/${uniqueFilename}`;

    if (this.isMockMode) {
      this.logger.log(
        `[Mock Mode] Generating simulated presigned URL for key: ${objectKey}`,
      );
      const mockUploadUrl = `https://mock-r2-upload.com/${
        this.bucketName
      }/${objectKey}?Content-Type=${encodeURIComponent(contentType)}`;
      const mockPublicUrl = `${this.publicUrl}/${objectKey}`;
      return {
        uploadUrl: mockUploadUrl,
        publicUrl: mockPublicUrl,
        key: objectKey,
      };
    }

    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: objectKey,
        ContentType: contentType,
      });

      // Generate signed URL valid for 15 minutes (900 seconds)
      const uploadUrl = await getSignedUrl(this.s3Client!, command, {
        expiresIn: 900,
      });

      const publicUrl = `${this.publicUrl}/${objectKey}`;

      return {
        uploadUrl,
        publicUrl,
        key: objectKey,
      };
    } catch (error) {
      this.logger.error(
        `Failed to generate presigned R2 upload URL: ${error.message}`,
      );
      throw error;
    }
  }
}
