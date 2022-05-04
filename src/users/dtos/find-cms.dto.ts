import { Transform } from 'class-transformer';
import { IsBooleanString, IsOptional, IsString } from 'class-validator';

export class FindCmsDto {
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  role?: string;

  @IsBooleanString()
  @IsOptional()
  isBuyCourse?: string;

  @IsBooleanString()
  @IsOptional()
  isBuy?: string;

  @IsString()
  @IsOptional()
  referralId?: string;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  limit?: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  skip?: number;
  
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  id?: number;
}
