import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FindTagDto {
    @IsOptional()
    name?: string;

    @IsOptional()
    uniqueName?: string;
    
    @Transform(({ value }) => parseInt(value))
    limit: number;
  
    @Transform(({ value }) => parseInt(value))
    skip: number;
}
