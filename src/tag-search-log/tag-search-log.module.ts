import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagSearchLog } from './entities/tag-search-log.entity';
import { TagSearchLogController } from './tag-search-log.controller';
import { TagSearchLogService } from './tag-search-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([TagSearchLog])],
  controllers: [TagSearchLogController],
  providers: [TagSearchLogService],
})
export class TagSearchLogModule {}
