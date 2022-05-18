import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindNovelAdvDto } from './dto/find-novel-adv.dto';
import { FindNovelDto } from './dto/find-novel.dto';
import { UpdateNovelDto } from './dto/update-novel.dto';
import { NovelService } from './novel.service';

@ApiTags('Novel')
@Controller('novel')
export class NovelController {
  constructor(private readonly novelService: NovelService) {}

  @Get()
  findAll(@Query() body: FindNovelDto) {
    return this.novelService.findAll(body);
  }

  
  @Get('/getByRanking')
  getByRanking() {
    return this.novelService.getByRanking();
  }

  @Get('/searchAdvance')
  searchAdvance(@Query() body : FindNovelAdvDto) {
    return this.novelService.searchAdvance(body);
  }

  @Get('/weeklyMostActive')
  weeklyMostActive() {
    return this.novelService.weeklyMostActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.novelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNovelDto: UpdateNovelDto) {
    return this.novelService.update(+id, updateNovelDto);
  }
}
