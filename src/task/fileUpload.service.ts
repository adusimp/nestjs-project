import { BadRequestException, Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { copyFile, unlink } from 'fs/promises';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Injectable()
export class FileUploadService {
  private storagePath = './uploads';

  async uploadFile(file: Express.Multer.File): Promise<string> {
    console.log(file);
    if (!file || file.size > 5 * 1024 * 1024) {
      throw new BadRequestException('Invalid file');
    }

    const uniquePath = `${this.storagePath}/${uuid()}-${file.originalname}`;

    await copyFile(file.path, uniquePath);
    await unlink(file.path);

    return uniquePath;
  }
}
export const multerconfig = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      cb(null, Date.now() + extname(file.originalname));
    },
  }),
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      return cb(new Error('Chỉ cho phép file ảnh!'), false);
    }
    cb(null, true);
  },
};
