import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import {NovelService} from "../novel/novel.service";

@Injectable()
export class NovelCronJobService {
  constructor(private schedulerRegistry: SchedulerRegistry
  ) {}
  @Cron('*/10 * * * * *')
  async crawlNovel() {
    // this.novelServices.crawlNovels()
  }
}
