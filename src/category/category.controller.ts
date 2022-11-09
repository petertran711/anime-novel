import {Body, Controller, Get, Param, Patch, Post, Query, UseGuards} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { FindCategoryDto } from './dto/find-category.dto';
import {CreateTagDto} from "../tag/dto/create-tag.dto";
import {CreateCategoryDto} from "./dto/create-category.dto";
import JwtAuthenticationGuard from "../auth/guards/jwt-authentication.guard";

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Post()
  create(@Body() createCateDto: CreateCategoryDto) {
    return this.categoryService.create(createCateDto);
  }

  @Get()
  findAll(@Query()body : FindCategoryDto) {
    return this.categoryService.findAll(body);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthenticationGuard)
  async updateUser(@Param('id') id: string, @Body() body: CreateCategoryDto) {
    return this.categoryService.update(parseInt(id), body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

}
