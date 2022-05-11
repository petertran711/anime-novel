import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateNovelDto {
    @ApiProperty()
    @IsOptional()
    views?: number;
  
    @ApiProperty()
    @IsOptional()
    author?: string;
  
    @ApiProperty()
    @IsOptional()
    rank?: string;
}
