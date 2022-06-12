import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateRateDto } from './dto/create-rate.dto';
import { RateService } from './rate.service';

@ApiTags('Rate')
@Controller('rate')
export class RateController {
  constructor(private readonly rateService: RateService) {}

  @Post()
  create(@Body() createRateDto: CreateRateDto) {
    return this.rateService.create(createRateDto);
  }

  @Get()
  findAll() {
    return this.rateService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rateService.findOne(+id);
  }
  
}
