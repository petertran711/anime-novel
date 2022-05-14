import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  create(createTagDto: CreateTagDto) {
    return 'This action adds a new tag';
  }

  findAll() {
    return getRepository(Tag).find();
  }

  findOne(id: number) {
    return getRepository(Tag).findOne();
  }

}
