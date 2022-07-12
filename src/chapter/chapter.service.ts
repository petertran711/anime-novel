import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { createUniqName } from 'src/helpers/ultils';
import { Novel } from 'src/novel/entities/novel.entity';
import { getRepository } from 'typeorm';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { FindChapterDto } from './dto/find-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';
import { Chapter } from './entities/chapter.entity';

@Injectable()
export class ChapterService {
  async create(createChapterDto: CreateChapterDto) {
    if (!createChapterDto.novelId) throw new BadRequestException('Thieu Novel ID');
    const novel = await getRepository(Novel).findOne({
      where: {
        id: createChapterDto.novelId,
      },
      relations: ['chapters'],
    });
    if (!novel) throw new NotFoundException('Novel khong ton tai');
    if (!createChapterDto.episode) {
      createChapterDto.episode = novel.chapters[novel.chapters.length - 1].episode
        ? novel.chapters[novel.chapters.length - 1].episode + 1
        : 1;
    }
    if (!createChapterDto.uniqueName) {
      createChapterDto.uniqueName = createUniqName(createChapterDto.name);
    }
    const data = Object.assign({}, createChapterDto, {
      novel,
    });
    const checkUniqueName = await getRepository(Chapter).findOne({
      where: {
        uniqueName: data.uniqueName,
      },
    });
    if (checkUniqueName) throw new NotFoundException('Trùng unique Name');
    return getRepository(Chapter).save(data);
  }

  findAll(body: FindChapterDto) {
    const chapter = getRepository(Chapter).createQueryBuilder('chapter').leftJoinAndSelect('chapter.novel', 'novel');

    if (body.uniqueName) {
      chapter.andWhere('novel.uniqueName =:uniqueName', { uniqueName: body.uniqueName });
    }
    if (body.limit !== undefined && body.limit !== null) {
      chapter.take(body.limit);
    }

    if (body.skip !== undefined && body.skip !== null && body.skip) {
      chapter.skip(body.skip);
    }

    return chapter.getManyAndCount();
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
