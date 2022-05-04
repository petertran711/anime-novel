import { Transform } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class FavoriteCourseDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  limit?: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  skip?: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  categoryId?: number;

  @IsString()
  @IsOptional()
  orderPrice?: string;
}
