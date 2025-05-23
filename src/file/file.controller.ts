import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { saveVideoToUploads } from '../uploads/file-uploader';
import { extractAudio } from '../audio/audio-extractor';
import { sendAudioToAssemblyAI } from '../transcription/send-to-assembly';
import * as path from 'path';

@Controller('api')
export class FileController {
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }

    try {
      // Sanitize filename: replace spaces and special chars
      const sanitizedFilename = file.originalname.replace(
        /[^a-z0-9.\-_]/gi,
        '_',
      );

      const isSaved = saveVideoToUploads(file.buffer, sanitizedFilename);
      if (!isSaved) throw new Error('Video save failed');

      const videoPath = path.join(process.cwd(), 'uploads', sanitizedFilename);

      const audioPath = await extractAudio(videoPath);

      await sendAudioToAssemblyAI(audioPath);

      return {
        message: 'Video uploaded, audio extracted, transcript saved',
      };
    } catch (error) {
      throw new HttpException(
        'Processing failed: ' + error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
