import * as fs from 'fs';
import * as paths from 'path';

let fileNameSuffix: number = 0;
let isAbleToWrite: boolean = false;
const filePath = paths.join(__dirname, `../../logs/error${fileNameSuffix}.log`);

try {
  if (!fs.existsSync(paths.dirname(filePath))) {
    fs.mkdirSync(paths.dirname(filePath));
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '', 'utf8');
  }
  isAbleToWrite = true;
} catch (err) {
  console.error('Error creating log file:', err);
  isAbleToWrite = true;
}

export async function errorLog(
  message: string,
  code: string | number = 0,
  method: string = '',
  path: string = '',
  ip: string = '',
) {
  const logData = `${new Date().toISOString()}: [${ip}] ${method || ''} ${code || ''} ${path || ''} \n${message}\n\n`;

  if (!isAbleToWrite) {
    console.log(logData);
    return false;
  }

  // Get the file size
  const fileSize = fs.statSync(filePath).size;
  console.log(`LOG File size: ${fileSize}`);

  // If file size exceeds 1 MB, rotate the file
  if (fileSize > 1024 * 1024 * 10) {
    fileNameSuffix++;
    errorLog(message, code, method, path, ip);
    return;
  }

  fs.appendFileSync(filePath, logData);
}
