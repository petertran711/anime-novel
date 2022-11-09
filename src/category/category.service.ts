import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {getRepository, Repository} from 'typeorm';
import { FindCategoryDto } from './dto/find-category.dto';
import { Category } from './entities/category.entity';
import {InjectRepository} from "@nestjs/typeorm";
import {Tag} from "../tag/entities/tag.entity";
import {CreateTagDto} from "../tag/dto/create-tag.dto";
import {CreateCategoryDto} from "./dto/create-category.dto";

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private cateGoryRepository: Repository<Category>) {
  }

  create(createCateDto: CreateCategoryDto) {
    try {
      const category = this.cateGoryRepository.create(createCateDto);
      return this.cateGoryRepository.save(category);
    } catch (e) {
      if (e.code === 'ER_DUP_ENTRY') {
        throw new BadRequestException('Trùng tên');
      }
    }
  }

  async update(id: number, attrs: CreateCategoryDto) {
    const tag = await this.findOne(id);
    if (!tag) throw new NotFoundException('Tag not found!');
    Object.assign(tag, attrs);
    return this.cateGoryRepository.save(tag);
  }

  findAll(body : FindCategoryDto) {
    const novels = getRepository(Category)
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.novels', 'novels')

    if (body.name) {
      novels.andWhere('category.name =:name', { name: body.name });
    }
    if (body.limit !== undefined && body.limit !== null) {
      novels.take(body.limit);
    }

    if (body.skip !== undefined && body.skip !== null && body.skip) {
      novels.skip(body.skip);
    }
    return novels.getManyAndCount();
  }

  async findOne(id: number) {
    if (!id) return null;
    let averageRate = 0;
    let totalCourseSell = 0;
    const cate = await this.cateGoryRepository.createQueryBuilder('category').andWhere('category.id = :id', {id}).getOne();
    return cate;
  }


}
