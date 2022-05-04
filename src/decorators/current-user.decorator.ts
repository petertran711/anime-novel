import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { User } from 'src/users/user.entity';
import { getRepository } from 'typeorm';

export const CurrentUser = createParamDecorator((data: never, context: ExecutionContext) => {
  const headers = context.switchToHttp().getRequest().headers;
  const accessToken = headers.authorization && headers.authorization.toString().replace('Bearer ', '') || null;
  console.log('accessToken', accessToken);
  if (accessToken) {
    const payload: any = jwt.decode(accessToken);
    return getRepository(User).findOne({ id: payload.userId });
  }
});
