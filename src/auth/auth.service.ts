import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { MailerService } from 'src/mailer/mailer.service';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { User } from 'src/users/user.entity';
import { UsersService } from 'src/users/users.service';
import { getRepository } from 'typeorm';
import { TokenPayload } from './tokenPayload.interface';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly mailSerivce: MailerService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async register(registrationData: CreateUserDto) {
    const { email, username } = registrationData;
    let users = await this.usersService.findByEmail(email);
    if (users.length) throw new BadRequestException('Email đã tồn tại');
    users = await this.usersService.findByUsername(username);
    if (users.length) throw new BadRequestException('Username đã tồn tại');
    if (registrationData.phoneNumber) {
      const checkPhone = await getRepository(User).findOne({ where: { phoneNumber: registrationData.phoneNumber } });
      if (checkPhone) throw new BadRequestException('Số điện thoại đã được sử dụng');
    }

    let userWithCode: User;
    // let referralParent: Referral;

    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    registrationData.password = hashedPassword;
    const user = await this.usersService.create(registrationData);
    return user;
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    const [user] = await this.usersService.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    await this.verifyPassword(plainTextPassword, user.password);
    user.password = undefined;
    return user;
  }

  private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    const isPasswordMatching = await bcrypt.compare(plainTextPassword, hashedPassword);
    if (!isPasswordMatching) {
      throw new UnauthorizedException('Wrong credentials provided');
    }
  }

  public async getCookieWithJwtToken(user: User) {
    const payload: TokenPayload = {
      userId: user.id
    };
    const secretKey = nanoid(10);
    await getRepository(User).update(user.id, { secrectKey: secretKey });
    const token = this.jwtService.sign(payload, { secret: secretKey });
    // const token = this.jwtService.sign(payload);
    return {
      access_token: token,
      userId: user.id,
      user: user,
      expiresIn: this.configService.get('JWT_EXPIRATION_TIME'),
      token_type: 'Bearer',
    };
    // return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
  }

  async signinWithSocialAccount(provider: string, accessToken: string) {
    if (provider === 'facebook') {
      // Check the access_token

      const fbuser = await new Promise((resolve, reject) => {
        this.httpService
          .get('https://graph.facebook.com/v12.0/me', {
            params: {
              fields: 'id, name, email, first_name,last_name',
              access_token: accessToken,
            },
          })
          .subscribe({
            next: (v) => {
              resolve(v.data);
            },
            error: (e) => reject(e),
          });
      });

      // if (err) {
      //   throw new BadRequestException('Bad credentials');
      // }
      return this.checkExistedUser('facebook', fbuser);
    }
  }

  async checkExistedUser(provider: string, user) {
    console.log('check user fb', user);
    let createUser;
    const socialId = user.id;
    const existedUsers = await getRepository(User).findOne({
      where: [
        {
          email: user.email,
        },
        {
          facebookId: socialId,
        },
      ],
    });
    if (existedUsers) {
      if (existedUsers.email && !existedUsers.facebookId) {
        console.log('vao 1');
        const updatedUser = Object.assign({}, existedUsers, { facebookId: socialId });
        createUser = getRepository(User).save(updatedUser);
        return createUser;
      } else {
        return existedUsers;
      }
    } else {
      const hashedPassword = await bcrypt.hash(randomBytes(10).toString('hex').toLocaleUpperCase(), 10);
      const facebookUser = {
        facebookId: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email || user.id + '@facebook.com',
        password: hashedPassword,
        isActive: true,
      };
      createUser = getRepository(User).create(facebookUser);
      return getRepository(User).save(createUser);
    }
  }

  async sendVerifyEmail(userId: number) {
    return this.usersService.sendVerificationEmail(userId);
  }

  async forgotPassword(email: string, domain: string) {
    console.log('email', email);
    const currentUser = await getRepository(User).findOne({ where: { email } });
    if (!currentUser) {
      throw new NotFoundException('Email does not exist');
    }
    const payload: TokenPayload = { userId: currentUser.id };
    const token = this.jwtService.sign(payload, {
      expiresIn: 300,
      secret: currentUser.secrectKey,
    });
    console.log('token reset', token);
    try {
      this.mailSerivce.sendForgotPassword(currentUser, token, domain);
    } catch (error) {
      throw error;
    }
  }
  async resetPassword(user: User, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return getRepository(User).update(user.id, { password: hashedPassword });
  }

  async verifyToken(data: any) {
    const decode: any = jwt.decode(data.token);
    if (decode.userId && decode.deviceType && decode.roles) {
      const existUser = await getRepository(User).findOne({
        where: {
          id: decode.userId,
        },
      });
      if (!existUser) throw new NotFoundException('User does not exist');
      const key = existUser.secrectKey
      try {
        jwt.verify(data.token, key);
        return decode;
      } catch (error) {
        console.log('verify token error', error);
        throw new UnauthorizedException('Token invalid');
      }
    } else {
      throw new UnauthorizedException('Token invalid');
    }
  }
}
