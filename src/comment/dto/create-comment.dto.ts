import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class CreateCommentDto {
    @ApiProperty()
    @IsOptional()
    content : string;

    @ApiProperty()
    @IsOptional()
    userId : number;

    @ApiProperty()
    @IsOptional()
    novelId : number;

    @ApiProperty()
    @IsOptional()
    parentId : number;

}
