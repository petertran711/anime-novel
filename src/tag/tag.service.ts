import { Injectable } from '@nestjs/common';
import { getRepository, Like } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { FindTagDto } from './dto/find-tag.dto';
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

  findByCharacter(body: FindTagDto) {
    return getRepository(Tag).findAndCount({
      where: {
        name: Like(`%${body.name}%`),
      },
      take: body.limit,
      skip: body.skip,
    });
  }
}
