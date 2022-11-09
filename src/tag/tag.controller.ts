import {Body, Controller, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateTagDto } from './dto/create-tag.dto';
import { FindTagDto } from './dto/find-tag.dto';
import { TagService } from './tag.service';
import JwtAuthenticationGuard from "../auth/guards/jwt-authentication.guard";

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

  @Patch('/:id')
  @UseGuards(JwtAuthenticationGuard)
  async updateUser(@Param('id') id: string, @Body() body: CreateTagDto) {
    return this.tagService.update(parseInt(id), body);
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
