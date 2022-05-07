import { Injectable } from '@nestjs/common';
import { Tag } from 'src/tag/entities/tag.entity';
import { getRepository } from 'typeorm';
import { CreateNovelDto } from './dto/create-novel.dto';
import { UpdateNovelDto } from './dto/update-novel.dto';

@Injectable()
export class NovelService {
  create(createNovelDto: CreateNovelDto) {
    return 'This action adds a new novel';
  }

  findAll() {
    return getRepository(Tag).find();
  }

  findOne(id: number) {
    return `This action returns a #${id} novel`;
  }

  update(id: number, updateNovelDto: UpdateNovelDto) {
    return `This action updates a #${id} novel`;
  }

  remove(id: number) {
    return `This action removes a #${id} novel`;
  }
}
