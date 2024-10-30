import * as crypto from 'crypto';

export function generateCode(): string {
  const randomUUID = crypto.randomUUID();
  return randomUUID;
}
