import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTagDto } from './dto/create-tag.dto';
import { FindTagDto } from './dto/find-tag.dto';
import { TagService } from './tag.service';

@ApiTags('Tags')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Get()
  findAll(@Query() body : FindTagDto) {
    return this.tagService.findAll(body);
  }

  @Get('/findByCharacter')
  findByCharacter(@Query() name : FindTagDto) {
    return this.tagService.findByCharacter(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagService.findOne(+id);
  }
}
