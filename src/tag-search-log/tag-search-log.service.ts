import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { TagSearchLog } from './entities/tag-search-log.entity';

@Injectable()
export class TagSearchLogService {
  async findAll() {
    const tags = await getRepository(TagSearchLog)
      .createQueryBuilder('log')
      .select('log.tagName')
      .distinct(true)
      .take(15)
      .getMany();
    return tags;
  }
}
