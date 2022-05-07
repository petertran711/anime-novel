import { Transform } from 'class-transformer';
import { IsEmail, IsOptional, IsPhoneNumber, isString, IsString, IsBoolean, IsNumber, IsBooleanString, isArray } from 'class-validator';
import { IsNull } from 'typeorm';

export class FindUserDto{

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  id?: number;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  gender?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;
  
  @IsString()
  @IsOptional()
  description?: string;

  // @Transform(({ value }) => parseInt(value))
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsBoolean()
  @IsOptional()
  isReferred?: string;


  @IsString()
  @IsOptional()
  facebookId?: string;

  @IsBooleanString()
  @IsOptional()
  isActive?: string;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  limit?: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  skip?: number;

}