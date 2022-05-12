import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class FindChapterDto {
    @ApiProperty()
    @IsOptional()
    uniqueName?: string;

}
