import { randomBytes } from 'crypto';

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
