import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Novel } from './entities/novel.entity';
import { NovelController } from './novel.controller';
import { NovelService } from './novel.service';
import {ChapterService} from "../chapter/chapter.service";
import {NovelCreatedListener} from "./listener/novel-create.listener";

@Module({
  imports : [TypeOrmModule.forFeature([Novel])],
  controllers: [NovelController],
  providers: [NovelService, ChapterService, NovelCreatedListener]
})
export class NovelModule {}
