import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import {getRepository, Repository} from "typeorm";
import {Review} from "./entities/review.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Category} from "../category/entities/category.entity";
import {FindCategoryDto} from "../category/dto/find-category.dto";

@Injectable()
export class ReviewService {
  constructor(@InjectRepository(Review) private reviewRepository: Repository<Review>) {
  }
  create(createReviewDto: CreateReviewDto) {
    try {
      const review = this.reviewRepository.create(createReviewDto);
      return  this.reviewRepository.save(review);
    } catch (e) {
        throw new BadRequestException(e.name);
    }
  }

  findAll(body : FindCategoryDto) {
    const review = getRepository(Review)
        .createQueryBuilder('review')
        .orderBy('review.updatedAt', 'DESC')

    if (body.name) {
      review.andWhere('review.name =:name', { name: body.name });
    }
    if (body.limit !== undefined && body.limit !== null) {
      review.take(body.limit);
    }

    if (body.skip !== undefined && body.skip !== null && body.skip) {
      review.skip(body.skip);
    }
    return review.getManyAndCount();
  }

  async findOne(id: number) {
    if (!id) return null;
    const review = await this.reviewRepository.createQueryBuilder('review').andWhere('review.id = :id', {id}).getOne();
    return review;
  }

  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const review = await this.findOne(id);
    if (!review) throw new NotFoundException('review not found!');
    Object.assign(review, updateReviewDto);
    return this.reviewRepository.save(review);
  }

  remove(id: number) {
    return `This action removes a #${id} review`;
  }
}
