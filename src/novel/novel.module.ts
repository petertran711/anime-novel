import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Novel } from './entities/novel.entity';
import { NovelController } from './novel.controller';
import { NovelService } from './novel.service';

@Module({
  imports : [TypeOrmModule.forFeature([Novel])],
  controllers: [NovelController],
  providers: [NovelService]
})
export class NovelModule {}
