import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { NovelService } from '../novel/novel.service';

@Injectable()
export class NovelCronJobService {
  constructor(private schedulerRegistry: SchedulerRegistry, private novelServices: NovelService) {}
  @Cron('*/59 * * * * *')
  async crawlNovel() {
    console.log('Run cron job after 1 min');
    this.novelServices.crawlNovels();
  }
}
