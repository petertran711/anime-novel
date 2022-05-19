import { Injectable, NotFoundException } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { FindNovelAdvDto } from './dto/find-novel-adv.dto';
import { FindNovelDto } from './dto/find-novel.dto';
import { UpdateNovelDto } from './dto/update-novel.dto';
import { Novel } from './entities/novel.entity';

@Injectable()
export class NovelService {
  async findAll(body: FindNovelDto) {
    const novels = getRepository(Novel)
      .createQueryBuilder('novel')
      .leftJoinAndSelect('novel.chapters', 'chapters')
      .leftJoinAndSelect('novel.categories', 'category')
      .leftJoinAndSelect('novel.tags', 'tag')
      .select(['novel', 'chapters', 'category.id', 'category.name', 'tag.id', 'tag.name', 'tag.uniqueName'])
      .orderBy('novel.updatedAt', 'DESC');

    if (body.name) {
      novels.andWhere('novel.name LIKE :name', { name: `%${body.name}%` });
    }
    if (body.uniqueName) {
      novels.andWhere('novel.uniqueName LIKE :uniqueName', { uniqueName: `%${body.uniqueName}%` });
    }
    if (body.author) {
      novels.andWhere('novel.author =:author', { author: body.author });
    }
    if (body.status) {
      novels.andWhere('novel.status =:status', { status: body.status });
    }
    if (body.categoryId) {
      novels.andWhere('category.id =:id', { id: body.categoryId });
    }
    if (body.tagUniqueName) {
      novels.andWhere('tag.uniqueName LIKE :uniqueName', { uniqueName: `%${body.tagUniqueName}%` });
    }

    if (body.tagId) {
      novels.andWhere('tag.id =:id', { id: body.tagId });
    }

    if (body.orderByView) {
      novels.orderBy('novel.views', 'DESC');
    }

    if (body.orderByLastUpdate) {
      novels.orderBy('chapters.updatedAt', 'DESC');
    }

    if (body.limit !== undefined && body.limit !== null) {
      novels.take(body.limit);
    }

    if (body.limit !== undefined && body.limit !== null && body.skip) {
      novels.skip(body.skip);
    }

    const data = await novels.getManyAndCount();
    // const tags = data
  }

  findOne(id: number) {
    return getRepository(Novel).findOne(id);
  }

  async getByRanking() {
    const mostRead = await getRepository(Novel).find({
      skip: 0,
      take: 10,
      order: {
        views: 'DESC',
      },
    });
    const newTrends = await getRepository(Novel).find({
      skip: 0,
      take: 10,
    });
    const userRate = await getRepository(Novel).find({
      skip: 0,
      take: 10,
    });

    const data = {
      mostRead,
      newTrends,
      userRate,
    };
    return data;
  }
  async weeklyMostActive() {
    return getRepository(Novel).find({
      skip: 0,
      take: 10,
    });
  }
  async searchAdvance(body: FindNovelAdvDto) {
    const novels = getRepository(Novel)
      .createQueryBuilder('novel')
      .leftJoinAndSelect('novel.chapters', 'chapters')
      .leftJoinAndSelect('novel.categories', 'category')
      .leftJoinAndSelect('novel.tags', 'tag')
      .select(['novel', 'chapters', 'category.id', 'category.name', 'tag.id', 'tag.name', 'tag.uniqueName'])
      .orderBy('novel.updatedAt', 'DESC');

    if (body.categoryIds && body.categoryIds.length > 0) {
      novels.andWhere('category.id IN(:...categoryIds)', { id: body.categoryIds });
    }
    if (body.tagIds && body.tagIds.length > 0) {
      novels.andWhere('tag.id IN(:...tagIds)', { id: body.tagIds });
    }
    if (body.limit !== undefined && body.limit !== null) {
      novels.take(body.limit);
    }

    if (body.limit !== undefined && body.limit !== null && body.skip) {
      novels.skip(body.skip);
    }

    return novels.getManyAndCount();
  }
  async update(id: number, updateNovelDto: UpdateNovelDto) {
    const existNovel = await getRepository(Novel).findOne(id);
    if (!existNovel) {
      throw new NotFoundException();
    }
    const update = Object.assign({}, existNovel, updateNovelDto);
    return getRepository(Novel).save(update);
  }
}
