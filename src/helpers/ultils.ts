import { randomBytes } from 'crypto';

export function getReferral(length: number){
    const code = randomBytes(length).toString('hex').toLocaleUpperCase();
    return code;
}