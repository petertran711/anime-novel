import { Injectable } from '@nestjs/common';
import { TagSearchLog } from 'src/tag-search-log/entities/tag-search-log.entity';
import { getRepository, Like } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { FindTagDto } from './dto/find-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagService {
  create(createTagDto: CreateTagDto) {
    return 'This action adds a new tag';
  }

  async findAll(body: FindTagDto) {
    const tags = getRepository(Tag).createQueryBuilder('tag').orderBy('tag.updatedAt', 'DESC');

    if (body.name) {
      tags.andWhere('tag.name LIKE :name', { name: `%${body.name}%` });
    }
    if (body.uniqueName) {
      tags.andWhere('tag.uniqueName LIKE :uniqueName', { uniqueName: `%${body.uniqueName}%` });
    }

    if (body.limit !== undefined && body.limit !== null) {
      tags.take(body.limit);
    }

    if (body.skip !== undefined && body.skip !== null && body.skip) {
      tags.skip(body.skip);
    }

    const data = await tags.getManyAndCount();
    if (data[0].length > 0) {
      const listTagSearch: TagSearchLog[] = [];
      data[0].forEach((it) => {
        listTagSearch.push({
          tagName: it.name,
          tagUniqueName: it.uniqueName,
        } as any);
      });
      if (listTagSearch.length > 0) {
        await this.createSearchData(data[0]);
      }
    }
    return data;
  }

  findOne(id: number) {
    return getRepository(Tag).findOne();
  }

  async findByCharacter(body: FindTagDto) {
    const data = await getRepository(Tag).findAndCount({
      where: {
        name: Like(`${body.name}%`),
      },
      take: body.limit,
      skip: body.skip,
    });
    if (data[0].length > 0) {
      await this.createSearchData(data[0]);
    }
    return data
  }
  async createSearchData(tagsearch: Tag[]) {
    if (tagsearch.length > 0) {
      const listTagSearch: TagSearchLog[] = [];
      tagsearch.forEach((it) => {
        listTagSearch.push({
          tagName: it.name,
          tagUniqueName: it.uniqueName,
        } as any);
      });
      if (listTagSearch.length > 0) {
        await getRepository(TagSearchLog).save(listTagSearch).catch(e=> console.log('duplicate'));
      }
    }
  }
}
