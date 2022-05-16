import { Injectable } from '@nestjs/common';
import { getRepository } from 'typeorm';
import { FindCategoryDto } from './dto/find-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  

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

    if (body.limit !== undefined && body.limit !== null && body.skip) {
      novels.skip(body.skip);
    }
    return novels.getManyAndCount();
  }

  findOne(id: number) {
    return getRepository(Category).findOne(id);
  }


}
