import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class CreateChapterDto {
  @IsOptional()
  name: string;

  @IsOptional()
  episode: number;

  @IsOptional()
  description: string;

  @IsOptional()
  uniqueName: string;

  @IsOptional()
  image: string;

  @IsOptional()
  content: string;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  novelId: number;
}
