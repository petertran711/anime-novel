import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { OrderBy as SortInterface } from 'src/helpers/enum';
export class FindNovelAdvDto {
   
    @IsOptional()
    categoryIds?: number [];

    @IsOptional()
    categoryCondition?: string;

    @IsOptional()
    tagIds?: number [];

    @IsOptional()
    tagCondition?: string;

    @IsOptional()
    rate?: number;

    @IsOptional()
    rateCondition?: string;

    @IsOptional()
    status?: string;

    @IsOptional()
    sortBy?: SortInterface;
    
    @Transform(({ value }) => parseInt(value))
    @IsOptional()
    limit?: number;
  
    @Transform(({ value }) => parseInt(value))
    @IsOptional()
    skip?: number;
}