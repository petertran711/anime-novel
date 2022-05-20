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

  findAll(body : FindTagDto) {
    const tags = getRepository(Tag)
      .createQueryBuilder('tag')
      .orderBy('tag.updatedAt', 'DESC');

    if (body.name) {
      tags.andWhere('tag.name LIKE :name', { name: `%${body.name}%` });
    }
    if (body.uniqueName) {
      tags.andWhere('tag.uniqueName LIKE :uniqueName', { uniqueName: `%${body.uniqueName}%` });
    }
    
    if (body.limit !== undefined && body.limit !== null) {
      tags.take(body.limit);
    }

    if (body.limit !== undefined && body.limit !== null && body.skip) {
      tags.skip(body.skip);
    }

    return tags.getManyAndCount();
  }

  findOne(id: number) {
    return getRepository(Tag).findOne();
  }

  findByCharacter(body: FindTagDto) {
    return getRepository(Tag).findAndCount({
      where: {
        name: Like(`${body.name}%`),
      },
      take: body.limit,
      skip: body.skip,
    });
  }
}
