import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class CreateRateDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  userId: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  rate: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  novelId: number;
}
