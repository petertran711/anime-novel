import { Injectable } from '@nestjs/common';
import { Novel } from 'src/novel/entities/novel.entity';
import { User } from 'src/users/user.entity';
import { getRepository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FindCommentDto } from './dto/find-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  async create(createCommentDto: CreateCommentDto) {
    const novel = await getRepository(Novel).findOne({ where: { id: createCommentDto.novelId } });
    const user = await getRepository(User).findOne({ where: { id: createCommentDto.userId } });
    let parent: Comment;
    if (createCommentDto.parentId) {
      parent = await getRepository(Comment).findOne({ where: { id: createCommentDto.parentId } });
    }
    let data = new Comment();
    data.content = createCommentDto.content;
    data.rate = createCommentDto.rate;
    data.parent = parent;
    data.user = user;
    data.novel = novel;
    return getRepository(Comment).save(data);
  }

  findAll(body: FindCommentDto) {
    const comment = getRepository(Comment)
    .createQueryBuilder('comment')
    .leftJoinAndSelect('comment.parent','parent')
    .leftJoinAndSelect('comment.user','user')
    .leftJoinAndSelect('comment.novel','novel').
    select(['comment', 'parent', 'user.id','user.email', 'user.avatar', 'novel' ]);
    if (body.userId) {
      comment.andWhere('comment.userId', { userId: body.userId });
    }
    if (body.parentId) {
      comment.andWhere('comment.parentId', { parentId: body.parentId });
    }
    if (body.userId) {
      comment.andWhere('comment.novelId', { novelId: body.novelId });
    }
    return comment.getManyAndCount();
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

 async update(id: number, updateCommentDto: UpdateCommentDto) {
    // const data = await
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
