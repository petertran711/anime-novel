import { Injectable, NotFoundException } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { CreateNovelDto } from './dto/create-novel.dto';
import { FindNovelDto } from './dto/find-novel.dto';
import { UpdateNovelDto } from './dto/update-novel.dto';
import { Novel } from './entities/novel.entity';

@Injectable()
export class NovelService {
  create(createNovelDto: CreateNovelDto) {
    return 'This action adds a new novel';
  }

  findAll(body : FindNovelDto) {
    const novels = getRepository(Novel).createQueryBuilder('novel')
    .leftJoinAndSelect('novel.chapters', 'chapters')
    .leftJoinAndSelect('novel.categories','categories')

    if(body.uniqueName) {
      novels.andWhere('novel.uniqueName =:uniqueName', {uniqueName : body.uniqueName}) 
    }
    if(body.author) {
      novels.andWhere('novel.author =:author', {author : body.author}) 
    }
    if(body.status) {
      novels.andWhere('novel.status =:status', {status : body.status}) 
    }
    return novels.getMany()
  }

  findOne(id: number) {
    return getRepository(Novel).findOne(id);
  }

  async update(id: number, updateNovelDto: UpdateNovelDto) {
    const existNovel = await getRepository(Novel).findOne(id);
    if (!existNovel) {
      throw new NotFoundException();
    }
    const update = Object.assign({}, existNovel, updateNovelDto);
    return getRepository(Novel).save(update);
  }

  remove(id: number) {
    return `This action removes a #${id} novel`;
  }
}
