import {ApiProperty} from "@nestjs/swagger";
import {IsOptional} from "class-validator";


export class TranslateDto {
    @ApiProperty()
    @IsOptional()
    data?: string;

    @ApiProperty()
    @IsOptional()
    target?: string;
}