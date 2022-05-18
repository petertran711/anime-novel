import { Transform } from 'class-transformer';
import { IsArray, IsDate, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

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
  description: string;

  @IsPhoneNumber('VN')
  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  gender: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  birthday: Date;

  @IsArray()
  @IsOptional()
  bookmark: number[];
}
