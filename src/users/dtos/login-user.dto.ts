import { IsEmail, IsOptional, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  access_token: string
}
