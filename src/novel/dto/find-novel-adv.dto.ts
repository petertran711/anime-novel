import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FindNovelAdvDto {
   
    @IsOptional()
    categoryIds?: number [];

    @IsOptional()
    tagIds?: number [];

    @Transform(({ value }) => parseInt(value))
    @IsOptional()
    limit?: number;
  
    @Transform(({ value }) => parseInt(value))
    @IsOptional()
    skip?: number;
}