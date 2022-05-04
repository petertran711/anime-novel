import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsDate, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { Role as RoleInterface } from 'src/helpers/enum';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsString()
  @IsOptional()
  fullName: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  isBuyCourse: boolean;

  @IsBoolean()
  @IsOptional()
  isActive: boolean;

  @IsPhoneNumber('VN')
  @IsString()
  @IsOptional()
  phoneNumber: string;

  // @IsBoolean()
  // @IsOptional()
  // isReferred: boolean;

  @IsString()
  @IsOptional()
  referralId: string;

  @IsString()
  @IsOptional()
  gender: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  birthday: Date;

  @IsArray()
  @IsOptional()
  favoriteCourse: number[];

  @IsString()
  @IsOptional()
  roles: RoleInterface;

  @IsOptional()
  jobTitleId?: number;

  @IsOptional()
  jobCareerId?: number;

  @IsString()
  @IsOptional()
  referralCode?: string;
}
