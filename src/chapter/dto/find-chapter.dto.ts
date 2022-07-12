import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class FindChapterDto {
    @ApiProperty()
    @IsOptional()
    uniqueName?: string;

    @Transform(({ value }) => parseInt(value))
    @IsOptional()
    limit?: number;
  
    @Transform(({ value }) => parseInt(value))
    @IsOptional()
    skip?: number;
}
