import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { FindChapterDto } from './dto/find-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { Chapter } from './entities/chapter.entity';

@Injectable()
export class ChapterService {
  create(createChapterDto: CreateChapterDto) {
    return 'This action adds a new chapter';
  }

  findAll(body : FindChapterDto) {
    const chapter = getRepository(Chapter).createQueryBuilder('novel')

    if(body.uniqueName) {
      chapter.andWhere('novel.uniqueName =:uniqueName', {uniqueName : body.uniqueName}) 
    }
    
    return chapter.getMany()
  }

  findOne(id: number) {
    return `This action returns a #${id} chapter`;
  }

  update(id: number, updateChapterDto: UpdateChapterDto) {
    return `This action updates a #${id} chapter`;
  }

  remove(id: number) {
    return `This action removes a #${id} chapter`;
  }
}
