import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FindCommentDto } from './dto/find-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  create(createCommentDto: CreateCommentDto) {
    return 'This action adds a new comment';
  }

  findAll(body: FindCommentDto) {
    const comment = getRepository(Comment).createQueryBuilder('comment');
    if (body.userId) {
      comment.andWhere('comment.userId', { userId: body.userId });
    }
    if (body.userId) {
      comment.andWhere('comment.novelId', { novelId: body.novelId });
    }
    return comment.getManyAndCount()
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
