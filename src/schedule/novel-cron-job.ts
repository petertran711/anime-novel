import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';

@Injectable()
export class NovelCronJob {
  private readonly logger = new Logger(NovelCronJob.name);

  @Interval(1000)
  handleCron() {
    this.logger.debug('Called every 10 seconds');
  }
}