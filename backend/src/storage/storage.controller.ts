import { Controller, Post, Body } from '@nestjs/common';
import { StorageService } from './storage.service';
import { GetPresignedUrlDto } from './dtos/get-presigned-url.dto';

@Controller('storage')
export class StorageController {
  constructor(private storageService: StorageService) {}

  @Post('presigned-url')
  async getPresignedUrl(@Body() dto: GetPresignedUrlDto) {
    return this.storageService.getPresignedUploadUrl(
      dto.filename,
      dto.contentType,
    );
  }
}
