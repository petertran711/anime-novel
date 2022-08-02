import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { createUniqName } from 'src/helpers/ultils';
import { InAppNotification } from 'src/in-app-notification/entities/in-app-notification.entity';
import { Novel } from 'src/novel/entities/novel.entity';
import { User } from 'src/users/user.entity';
import { getRepository, IsNull, Not } from 'typeorm';
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
    const userHasBookmark = await getRepository(User).find({
      where: {
        bookmark: Not(IsNull()),
      },
    });
    if (userHasBookmark.length > 0) {
      const listUser = userHasBookmark.filter((it) =>
        it.bookmark.find((it1) => it1.toString() == createChapterDto.novelId.toString()),
      );
      if (listUser.length > 0) {
        await Promise.all(
          userHasBookmark.map(async (it) => {
            await getRepository(InAppNotification).save({
              user: it,
              title: 'New chapter updated',
              message: `New chapter of novel ${novel.name} was created`,
            } as InAppNotification);
          }),
        );
      }
    }
    return getRepository(Chapter).save(data);
  }

  findAll(body: FindChapterDto) {
    const chapter = getRepository(Chapter).createQueryBuilder('chapter').leftJoinAndSelect('chapter.novel', 'novel');

    if (body.uniqueName) {
      chapter.andWhere('chapter.uniqueName =:uniqueName', { uniqueName: body.uniqueName });
    }

    if (body.novelUniqueName) {
      chapter.andWhere('novel.uniqueName =:uniqueName', { uniqueName: body.novelUniqueName });
    }
    if (body.limit !== undefined && body.limit !== null) {
      chapter.take(body.limit);
    }

    if (body.skip !== undefined && body.skip !== null && body.skip) {
      chapter.skip(body.skip);
    }
    console.log(chapter.getQuery(), 'tan query');
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
