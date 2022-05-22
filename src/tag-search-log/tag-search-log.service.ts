import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { TagSearchLog } from './entities/tag-search-log.entity';

@Injectable()
export class TagSearchLogService {
  async findAll() {
    const tags = await getRepository(TagSearchLog)
      .createQueryBuilder('tag_search_log')
      .select('DISTINCT(tag_search_log.tagName)')
      .take(15)
      .getMany();
    return tags;
  }
}
