import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateGoogleDto } from './dto/create-google.dto';
import { UpdateGoogleDto } from './dto/update-google.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Review} from "../review/entities/review.entity";
import {getRepository, Repository} from "typeorm";
import {Google} from "./entities/google.entity";
import {FindGoogleDto} from "./dto/find-google.dto";

@Injectable()
export class GoogleService {
  constructor(@InjectRepository(Google) private googleRepository: Repository<Google>) {
  }f
  create(createGoogleDto: CreateGoogleDto) {
    try {
      const google = this.googleRepository.create(createGoogleDto);
      return  this.googleRepository.save(google);
    } catch (e) {
      throw new BadRequestException(e.name);
    }
  }

  findAll(body : FindGoogleDto) {
    const google = getRepository(Google)
        .createQueryBuilder('google')
        .orderBy('google.updatedAt', 'DESC')

    if (body.domain) {
      google.andWhere('google.domain =:name', { name: body.domain });
    }
    if (body.limit !== undefined && body.limit !== null) {
      google.take(body.limit);
    }

    if (body.skip !== undefined && body.skip !== null && body.skip) {
      google.skip(body.skip);
    }
    return google.getManyAndCount();
  }

  async findOne(id: number) {
    if (!id) return null;
    const google = await this.googleRepository.createQueryBuilder('google').andWhere('google.id = :id', {id}).getOne();
    return google;
  }

  async update(id: number, updateGoogleDto: UpdateGoogleDto) {
    const google = await this.findOne(id);
    if (!google) throw new NotFoundException('review not found!');
    Object.assign(google, updateGoogleDto);
    return this.googleRepository.save(google);
  }

  remove(id: number) {
    return `This action removes a #${id} google`;
  }
}
