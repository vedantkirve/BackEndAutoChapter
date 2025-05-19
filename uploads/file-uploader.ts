import * as fs from 'fs';
import * as path from 'path';

export function saveVideoToUploads(buffer: Buffer, filename: string): boolean {
  try {
    const uploadDir = path.join(__dirname, '..', '..', 'uploads');

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const uploadPath = path.join(uploadDir, filename);

    fs.writeFileSync(uploadPath, buffer);

    return true;
  } catch (err) {
    console.error('Error saving file:', err);
    return false;
  }
}
