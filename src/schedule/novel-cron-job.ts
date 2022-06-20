import { Injectable } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class NovelCronJobService {
  constructor(private schedulerRegistry: SchedulerRegistry) {}
  @Cron('*/10 * * * * *')
  async crawlNovel() {
    console.log('My cron running after 10 sec...');
  }
}
