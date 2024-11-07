import * as crypto from 'crypto';
import { Request } from 'express';

export function generateCode(): string {
  const randomUUID = crypto.randomUUID();
  console.log(crypto.createHash('sha256').update(randomUUID).digest('hex'));
  return randomUUID;
}

export function isXhr(req: Request): boolean {
  return (
    req.headers['X-Requested-With'] === 'XMLHttpRequest' ||
    req.headers['content-type'] === 'application/json'
  );
}
