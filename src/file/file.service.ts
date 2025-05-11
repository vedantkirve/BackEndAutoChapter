import { Injectable } from '@nestjs/common';
import { Express } from 'express';

@Injectable()
export class FileService {
  async processFile(file: Express.Multer.File) {
    // TODO: Add logic to extract audio or store file metadata in DB
    console.log('File saved:', file.path);
    return {
      message: 'File uploaded successfully',
      path: file.path,
    };
  }
}
