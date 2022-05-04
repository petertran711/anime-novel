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
  @Length(3, 100)
  fullName?: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsPhoneNumber('VN')
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsBoolean()
  @IsOptional()
  isReferred?: boolean;

  @IsString()
  @IsOptional()
  referralCode?: string;

  @IsString()
  @IsOptional()
  referralId?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsBoolean()
  @IsOptional()
  isCreateContent?: boolean;

  @IsDate()
  @IsOptional()
  birthday?: Date;

  @IsString()
  @IsOptional()
  roles: RoleInterface;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  jobTitleId?: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  jobCareerId?: number;

  @ApiHideProperty()
  parent?: User;

  @ApiHideProperty()
  chain?: number[];
  //   @IsString()
  //   @IsOptional()
  //   referralId?: string;
}
