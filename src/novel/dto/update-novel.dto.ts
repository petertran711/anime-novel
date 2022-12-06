import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateNovelDto {
    @ApiProperty()
    @IsOptional()
    author?: string;

    @ApiProperty()
    @IsOptional()
    rank?: string;

    @ApiProperty()
    @IsOptional()
    active?: boolean;

    @ApiProperty()
    @IsOptional()
    image?: string;

    @ApiProperty()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsOptional()
    categories: string[];

    @ApiProperty()
    @IsOptional()
    tags: string[];

    @ApiProperty()
    @IsOptional()
    status?: string;

    @ApiProperty()
    @IsOptional()
    sourceLink: string;


}
