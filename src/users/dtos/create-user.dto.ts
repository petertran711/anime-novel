import { ApiHideProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Role as RoleInterface } from 'src/helpers/enum';
import { Match } from 'src/validators/match.validator';
import { User } from '../user.entity';

export class CreateUserDto {
  @IsString()
  @IsOptional()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
  password: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Match('password')
  passwordConfirm: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsPhoneNumber('VN')
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  
  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsDate()
  @IsOptional()
  birthday?: Date;

  @IsString()
  @IsOptional()
  roles: RoleInterface;

}
