import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { User } from 'src/users/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      passReqToCallback: true,
      usernameField: 'email',
    });
  }
  async validate(req: any, email: string, password: string): Promise<User> {
    const user = await this.authService.getAuthenticatedUser(email, password);
    if(!user.isActive) {
      throw new ForbiddenException('Khách hàng chưa được kích hoạt!')
    }
    return user;
  }
}
