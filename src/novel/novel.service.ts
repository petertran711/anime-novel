import { Injectable, NotFoundException } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { FindNovelDto } from './dto/find-novel.dto';
import { UpdateNovelDto } from './dto/update-novel.dto';
import { Novel } from './entities/novel.entity';

@Injectable()
export class NovelService {
  findAll(body: FindNovelDto) {
    const novels = getRepository(Novel)
      .createQueryBuilder('novel')
      .leftJoinAndSelect('novel.chapters', 'chapters')
      .leftJoinAndSelect('novel.categories', 'categories')
      .orderBy('novel.updatedAt', 'DESC');

    if (body.uniqueName) {
      novels.andWhere('novel.uniqueName =:uniqueName', { uniqueName: body.uniqueName });
    }
    if (body.author) {
      novels.andWhere('novel.author =:author', { author: body.author });
    }
    if (body.status) {
      novels.andWhere('novel.status =:status', { status: body.status });
    }
    if (body.limit !== undefined && body.limit !== null) {
      novels.take(body.limit);
    }

    if (body.limit !== undefined && body.limit !== null && body.skip) {
      novels.skip(body.skip);
    }
    return novels.getMany();
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
      relations: [''],
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

  async update(id: number, updateNovelDto: UpdateNovelDto) {
    const existNovel = await getRepository(Novel).findOne(id);
    if (!existNovel) {
      throw new NotFoundException();
    }
    const update = Object.assign({}, existNovel, updateNovelDto);
    return getRepository(Novel).save(update);
  }
}
