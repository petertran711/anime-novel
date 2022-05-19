import { Controller, Get } from '@nestjs/common';
import { TagSearchLogService } from './tag-search-log.service';

@Controller('tag-search-log')
export class TagSearchLogController {
  constructor(private readonly tagSearchLogService: TagSearchLogService) {}

  @Get()
  findAll() {
    return this.tagSearchLogService.findAll();
  }
}
