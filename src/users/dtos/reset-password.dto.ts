import { IsOptional, IsString } from "class-validator"

export class ResetPasswordDto {

    @IsString()
    password : string

    @IsString()
    @IsOptional()
    oldPassword ?: string
}