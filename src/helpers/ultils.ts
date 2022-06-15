import { randomBytes } from 'crypto';
import * as fs from 'fs';
import * as https from 'https';
export function getReferral(length: number) {
  const code = randomBytes(length).toString('hex').toLocaleUpperCase();
  return code;
}

export function createUniqName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
}

export async function donwloadFileFromURL(url: string, path: string, fileName: string) {
  const filePath = path + fileName;
  const file = fs.createWriteStream(filePath);
  const request = https.get(url);
  request.on('response', function (response) {
    response.pipe(file);
    // after download completed close filestream
    file.on('finish', () => {
      file.close();
      return filePath;
    });
    file.on('error', (err) => {
      file.close();
      console.log('Cannot donwload file', err.message);
    });
  });
  request.on('error', function (response) {
    // this.logger.error(`Error:: download file s3`, response.message && response.message);
    //
  });
}
