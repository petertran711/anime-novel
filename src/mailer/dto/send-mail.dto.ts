import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export class SendMailDto {
    @IsEmail()
    email: string

    @IsUrl()
    @IsOptional()
    url?: string

    @IsString()
    @IsOptional()
    name?: string
}
