import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { copyFile, unlink } from 'fs/promises';

@Injectable()
export class FileUploadService {
  private storagePath = './uploads';

  async uploadFile(file: Express.Multer.File): Promise<string> {
    // Validate file existence and size
    console.log(file)
    if (!file || file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('Invalid file');
    }

    // Create unique path & move file to permanent storage
    const uniquePath = `${this.storagePath}/${uuid()}-${file.originalname}`;

    await copyFile(file.path, uniquePath);
    await unlink(file.path); // Clean up temp file

    return uniquePath;
  }
}
