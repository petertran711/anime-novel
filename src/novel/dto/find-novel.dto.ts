import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FindNovelDto {
    @ApiProperty()
    @IsOptional()
    name?: string;
    
    @ApiProperty()
    @IsOptional()
    uniqueName?: string;

    @ApiProperty()
    @IsOptional()
    tagUniqueName?: string;
  
    @ApiProperty()
    @IsOptional()
    author?: string;
  
    @ApiProperty()
    @IsOptional()
    status?: string;
  
    @Transform(({ value }) => parseInt(value))
    @IsOptional()
    categoryId?: number;
  
    @Transform(({ value }) => parseInt(value))
    @IsOptional()
    tagId?: number;

    @IsOptional()
    orderByView?: string;

    @IsOptional()
    orderByLastCreate?: boolean;

    @IsOptional()
    orderByLastUpdate?: boolean;

    @Transform(({ value }) => parseInt(value))
    @IsOptional()
    limit?: number;
  
    @Transform(({ value }) => parseInt(value))
    @IsOptional()
    skip?: number;
}