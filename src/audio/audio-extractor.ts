import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import * as fs from 'fs';

export async function extractAudio(videoPath: string): Promise<string> {
  const filename = path.basename(videoPath, path.extname(videoPath));

  const audioDir = path.join(process.cwd(), 'audio');
  const audioPath = path.join(audioDir, `${filename}.mp3`);

  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .noVideo()
      .audioCodec('libmp3lame')
      .save(audioPath)
      .on('end', () => resolve(audioPath))
      .on('error', (err) => {
        console.error('FFmpeg error:', err);
        reject(err);
      });
  });
}
