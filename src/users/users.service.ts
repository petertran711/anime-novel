import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { FindConditions, getRepository, Repository } from 'typeorm';
import { MailerService } from '../mailer/mailer.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { FindUserDto } from './dtos/find-user.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { User } from './user.entity';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  create(body: CreateUserDto) {
    const user = this.usersRepository.create(body);
    return this.usersRepository.save(user);
  }

  findFacebook(filter: FindConditions<User>) {
    return this.usersRepository.find(filter);
  }

  find({
    id,
    email,
    username,
    firstName,
    lastName,
    phoneNumber,
    facebookId,
    isActive,
    limit,
    skip,
  }: FindUserDto) {
    const user = getRepository(User)
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.childRefs', 'children-ref')
      .leftJoinAndSelect('children-ref.parentUser', 'parentUser');
    if (id) {
      user.andWhere('user.id = :id', { id });
    }
    if (email) {
      user.andWhere('user.email = :email', { email });
    }
    if (username) {
      user.andWhere('user.username = :username', { username });
    }
    if (firstName) {
      user.andWhere('user.firstName = :firstName', { firstName });
    }
    if (lastName) {
      user.andWhere('user.lastName = :lastName', { lastName });
    }
   

    if (phoneNumber) {
      user.andWhere('user.phoneNumber = :phoneNumber', { phoneNumber });
    }

    if (facebookId) {
      user.andWhere('user.facebookId = :facebookId', { facebookId });
    }

    if (isActive === 'true') {
      user.andWhere('user.isActive = 1');
    } else if (isActive === 'false') {
      user.andWhere('user.isActive = 0');
    }

    if (limit !== undefined && limit !== null) {
      user.take(limit);
    }

    if (limit !== undefined && limit !== null && skip) {
      user.skip(skip);
    }

    return user.getManyAndCount();
  }

  async findOne(id: number) {
    if (!id) return null;
    let averageRate = 0;
    let totalCourseSell = 0;
    const user = await this.usersRepository.createQueryBuilder('user').andWhere('user.id = :id', { id }).getOne();
    return user;
  }

  findByEmail(email: string) {
    return (
      this.usersRepository
        .createQueryBuilder('user')
        // .leftJoinAndSelect('user.childRefs', 'children-ref')
        // .leftJoinAndSelect('children-ref.parentUser', 'parentUser')
        .where('user.email = :email', {
          email,
        })
        .addSelect(['user.password'])
        .getMany()
    );
  }

  findByUsername(username: string) {
    return this.usersRepository.find({ username });
  }

  
  async update(id: number, attrs: UpdateUserDto) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found!');
    Object.assign(user, attrs);
    await this.usersRepository.save(user);
  }

  async remove(id: number) {
    const user = await this.usersRepository.findOne({
      where: {
        id,
      },
      relations: ['parent'],
    });
    if (!user) throw new NotFoundException('User not found!');
    return this.usersRepository.update(user.id, {
      isDelete: true,
    });
  }

  async sendVerificationEmail(userId: number) {
    const user = await this.findOne(userId);
    if (!user) throw new NotFoundException('User not found!');

    // Generate activation code
    const code = randomBytes(20).toString('hex');
    user.activationCode = code;
    await this.usersRepository.save(user);

    // Send to user's email
    const baseUrl = this.configService.get<string>('BASE_URL');
    const url = `${baseUrl}/users/${user.id}/verify?code=${user.activationCode}`;
    this.mailerService.sendVerificationEmail(user.email, url);
  }

  async verify(id: number, code: string) {
    console.log(id, code);

    const user = await this.usersRepository.findOne({
      id: id,
      activationCode: code,
    });

    if (!user) {
      throw new BadRequestException('Wrong activation code');
    }

    user.isActive = true;

    return this.usersRepository.save(user);
  }

  sendWelcomeEmail(email: string) {
    return this.mailerService.sendWelcomeEmail(email);
  }

  async changePassword(user: User, resetPassDto: ResetPasswordDto) {
    // verify token
    const { oldPassword, password } = resetPassDto;
    const existUser = await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.password', 'user.email', 'user.id'])
      .andWhere(`user.id =${user.id}`)
      .getOne();
    if (!existUser) {
      throw new NotFoundException('Không tìm thấy user');
    }
    if (oldPassword) {
      const isPasswordMatching = await bcrypt.compare(oldPassword, existUser.password);
      if (!isPasswordMatching) {
        throw new NotFoundException('Mật khẩu cũ không đúng');
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      existUser.password = hashedPassword;
      return getRepository(User)
        .save(existUser)
        .catch((e) => console.log('cannot update user', e));
    }
  }
}
