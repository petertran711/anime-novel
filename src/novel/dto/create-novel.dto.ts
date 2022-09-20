import { IsOptional } from 'class-validator';

export class CreateNovelDto {
  @IsOptional()
  name: string;

  @IsOptional()
  uniqueName: string;

  @IsOptional()
  description: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  author?: string;

  @IsOptional()
  status?: string;

  @IsOptional()
  active?: boolean;

  @IsOptional()
  sourceLink: string;

  @IsOptional()
  categories: string[];

  @IsOptional()
  tags: string[];
}
