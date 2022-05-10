import { IsEmail, IsOptional, IsString } from 'class-validator';

export class SocialLogin {
  @IsEmail()
  email: string;

  @IsOptional()
  first_name: string;

  @IsOptional()
  last_name: string;

  @IsOptional()
  id: string;

  @IsString()
  provider : string
}
