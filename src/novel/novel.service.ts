import { Injectable, NotFoundException } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { CreateNovelDto } from './dto/create-novel.dto';
import { UpdateNovelDto } from './dto/update-novel.dto';
import { Novel } from './entities/novel.entity';

@Injectable()
export class NovelService {
  create(createNovelDto: CreateNovelDto) {
    return 'This action adds a new novel';
  }

  findAll() {
    return getRepository(Novel).find({
      relations: ['chapters', 'categories'],
    });
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
