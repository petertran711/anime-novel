import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { TagSearchLog } from './entities/tag-search-log.entity';

@Injectable()
export class TagSearchLogService {
   findAll() {
    return getRepository(TagSearchLog).find();
  }
}
