import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/users/user.entity';
import { getRepository } from 'typeorm';

@Injectable()
export default class JwtAuthenticationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const headers = context.switchToHttp().getRequest().headers;
    const accessToken = (headers.authorization && headers.authorization.toString().replace('Bearer ', '')) || null;
    let decoded;
    if (accessToken) {
      try {
        const payload: any = jwt.decode(accessToken);
        const user = await getRepository(User).findOne({ id: payload.userId, isDelete: false });
        const key = user.secrectKey
        decoded = jwt.verify(accessToken, key);
      } catch (err) {
        console.log('eerr', err);
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException('Token Invalid');
    }
    return true;
  }
}
