import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FindNovelDto {
    @ApiProperty()
    @IsOptional()
    uniqueName?: string;
  
    @ApiProperty()
    @IsOptional()
    author?: string;
  
    @ApiProperty()
    @IsOptional()
    status?: string;
}
