import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { TagSearchLog } from 'src/tag-search-log/entities/tag-search-log.entity';
import {getRepository, Like, Repository} from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { FindTagDto } from './dto/find-tag.dto';
import { Tag } from './entities/tag.entity';
import {InjectRepository} from "@nestjs/typeorm";
import {UpdateUserDto} from "../users/dtos/update-user.dto";

@Injectable()
export class TagService {

  constructor(@InjectRepository(Tag) private tagRepository: Repository<Tag>) {
  }
  create(createTagDto: CreateTagDto) {
    try {
      const category = this.tagRepository.create(createTagDto);
      return this.tagRepository.save(category);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Trùng tên');
      }
    }
  }

  async update(id: number, attrs: CreateTagDto) {
    const tag = await this.findOne(id);
    if (!tag) throw new NotFoundException('Tag not found!');
    Object.assign(tag, attrs);
    return this.tagRepository.save(tag);
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

  async findOne(id: number) {
    if (!id) return null;
    let averageRate = 0;
    let totalCourseSell = 0;
    const tag = await this.tagRepository.createQueryBuilder('tag').andWhere('tag.id = :id', {id}).getOne();
    return tag;
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
