import { ApiProperty } from "@nestjs/swagger";
import {IsNumber, IsOptional, Max, Min} from "class-validator";
import {Rate} from "../../rate/entities/rate.entity";

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

    @IsNumber()
    @Min(1)
    @Max(5)
    rate: number;

}
