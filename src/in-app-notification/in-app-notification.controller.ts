import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InAppNotificationService } from './in-app-notification.service';
import { UpdateInAppNotificationDto } from './dto/update-in-app-notification.dto';
import { CreateInAppNotificationDto } from './dto/create-in-app-notification.dto';
import { ApiTags } from '@nestjs/swagger';
import { FindInAppNotificationDto } from './dto/find-in-app-notification.dto';
import { number } from 'joi';
import { use } from 'passport';

@Controller('in-app-notification')
@ApiTags('in-app-notification')
export class InAppNotificationController {
  constructor(private readonly inAppNotificationService: InAppNotificationService) {}

  @Post()
  create(@Body() createInAppNotificationDto: CreateInAppNotificationDto) {
    return this.inAppNotificationService.create(createInAppNotificationDto);
  }

  @Get()
  findAll(@Query() findParams: FindInAppNotificationDto) {
    return this.inAppNotificationService.findAll(findParams);
  }

  @Post('/readAll')
  readAll(@Body() parram: FindInAppNotificationDto) {
    return this.inAppNotificationService.readAll(parram.userId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInAppNotificationDto: UpdateInAppNotificationDto) {
    return this.inAppNotificationService.update(+id, updateInAppNotificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inAppNotificationService.remove(+id);
  }

  @Get('countUnRead')
  getCountUnRead(@Query() findParams: FindInAppNotificationDto) {
    return this.inAppNotificationService.getCountUnRead(findParams);
  }
}
