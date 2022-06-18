import {IsOptional} from "class-validator";

export class CreateChapterDto {
    @IsOptional()
    name: string;

    @IsOptional()
    uniqueName: string;

    @IsOptional()
    description: string;

    @IsOptional()
    content: string;
}
