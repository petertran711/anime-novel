import {Controller, Get, Post, Body, Patch, Param, Delete, Query} from '@nestjs/common';
import { GoogleService } from './google.service';
import { CreateGoogleDto } from './dto/create-google.dto';
import { UpdateGoogleDto } from './dto/update-google.dto';
import {FindGoogleDto} from "./dto/find-google.dto";

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Post()
  create(@Body() createGoogleDto: CreateGoogleDto) {
    return this.googleService.create(createGoogleDto);
  }

  @Get()
  findAll(@Query()body : FindGoogleDto) {
    return this.googleService.findAll(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.googleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGoogleDto: UpdateGoogleDto) {
    return this.googleService.update(+id, updateGoogleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.googleService.remove(+id);
  }
}
