import * as fs from 'fs';
import * as path from 'path';

export function saveVideoToUploads(buffer: Buffer, filename: string): boolean {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fullPath = path.join(uploadsDir, filename);
    fs.writeFileSync(fullPath, buffer);

    return true;
  } catch (error) {
    console.error('Failed to save video:', error);
    return false;
  }
}
