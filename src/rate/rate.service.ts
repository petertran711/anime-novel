import { Injectable, NotFoundException } from '@nestjs/common';
import { Novel } from 'src/novel/entities/novel.entity';
import { User } from 'src/users/user.entity';
import { getRepository } from 'typeorm';
import { CreateRateDto } from './dto/create-rate.dto';
import { Rate } from './entities/rate.entity';

@Injectable()
export class RateService {
  async create(createRateDto: CreateRateDto) {
    const user = await getRepository(User).findOne({ where: { id: createRateDto.userId } , select :['id','email']});
    const novel = await getRepository(Novel).findOne({ where: { id: createRateDto.novelId }, select: ['id','name'] });
    if (!user || !novel) {
      throw new NotFoundException('User or novel not found');
    }
    const data = {
      rate: createRateDto.rate,
      user,
      novel,
    };
    return getRepository(Rate).save(data);
  }

  findAll() {
    return getRepository(Rate).find({
      relations: ['user', 'novel']
    });
  }

  findOne(id: number) {
    return getRepository(Rate).find({
      relations: ['user', 'novel'],
      where: {
        id,
      },
    });
  }
}
