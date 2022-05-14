import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";

export class FindCategoryDto {
    @ApiProperty()
    @IsOptional()
    name?: string;
    
    @Transform(({ value }) => parseInt(value))
    @IsOptional()
    limit?: number;
  
    @Transform(({ value }) => parseInt(value))
    @IsOptional()
    skip?: number;
}
