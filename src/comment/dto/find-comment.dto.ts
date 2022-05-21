import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class FindCommentDto {
    @ApiProperty()
    @IsOptional()
    userId?: number;

    @ApiProperty()
    @IsOptional()
    novelId?: number;

    @ApiProperty()
    @IsOptional()
    parentId?: number;
  
}
