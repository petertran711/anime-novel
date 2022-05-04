import { IsEmail, IsOptional, IsString } from 'class-validator';
import { DeviceType } from 'src/helpers/enum';

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

  @IsString()
  deviceType: DeviceType
}
