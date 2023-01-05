import { Inject, Injectable, Logger, LoggerService } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NovelService } from '../novel/novel.service';

@Injectable()
export class NovelCronJobService {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
  private novelServices: NovelService) {}
  @Cron('*/30 * * * *')
  async crawlNovel() {
    this.logger.log('Run cron job after 30 min');
    return this.novelServices.crawlNovels().catch((e) => {
      this.logger.error('Cannot craw novel', e);
    });
  }
}
