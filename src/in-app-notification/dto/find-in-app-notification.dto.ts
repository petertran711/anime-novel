import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class FindInAppNotificationDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @ApiProperty()
  userId?: number;

  @IsOptional()
  @ApiProperty()
  isRead?: boolean;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  skip?: number;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  limit?: number;
}
