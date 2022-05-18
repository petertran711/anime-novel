import { Transform } from "class-transformer";
import { IsOptional } from "class-validator";

export class BookmarkDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  limit?: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  skip?: number;

}
