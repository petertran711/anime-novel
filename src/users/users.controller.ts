import {
  Body,
  Controller, Get,
  HttpCode,
  NotFoundException,
  Param, Patch, Post,
  Query,
  Res,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-authentication.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { BookmarkDto } from './dtos/bookmark.dto';
import { FindUserDto } from './dtos/find-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get()
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  find(@Query() body: FindUserDto) {
    return this.usersService.find(body);
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) throw new NotFoundException('User not found!');
    return user;
  }

  @Patch('/:id')
  @UseGuards(JwtAuthenticationGuard)
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
  
  @Get('/:id/getBookmark')
  async favoriteCourse(@Param('id') id: number, @Query() query: BookmarkDto) {
    return this.usersService.getBookmark(id, query);
  }

  @Serialize(UserDto)
  @Post('/:id/sendVerificationEmail')
  sendVerificationEmail(@Param('id') id: number) {
    return this.usersService.sendVerificationEmail(id);
  }

  @Serialize(UserDto)
  @HttpCode(200)
  @Get('/:id/verify')
  async verifyAccount(@Res() res: Response, @Param('id') id: number, @Query('code') code: string) {
    const user = await this.usersService.verify(id, code);
    if (user) {
      await this.usersService.sendWelcomeEmail(user.email);
      res.redirect('/verifyAccount.html');
    }
  }

  
}

