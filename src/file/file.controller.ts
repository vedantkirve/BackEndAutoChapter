import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveVideoToUploads } from 'uploads/file-uploader';

@Controller('api')
export class FileController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      const isSaved = saveVideoToUploads(file.buffer, file.originalname);

      if (isSaved) {
        return { message: 'Video uploaded successfully' };
      } else {
        throw new HttpException(
          'Failed to save video',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
