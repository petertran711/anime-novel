import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TagSearchLogService } from './tag-search-log.service';

@ApiTags('TagsLog')
@Controller('tag-search-log')
export class TagSearchLogController {
  constructor(private readonly tagSearchLogService: TagSearchLogService) {}

  @Get()
  findAll() {
    return this.tagSearchLogService.findAll();
  }
}
