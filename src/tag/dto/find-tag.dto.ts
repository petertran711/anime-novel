import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FindTagDto {
    @ApiProperty()
    @IsOptional()
    name?: string;
    
    @Transform(({ value }) => parseInt(value))
    limit: number;
  
    @Transform(({ value }) => parseInt(value))
    skip: number;
}
