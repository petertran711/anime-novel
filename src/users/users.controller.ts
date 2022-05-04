import {
  Controller, Get,
  HttpCode,
  NotFoundException,
  Param, Post,
  Query,
  Res,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-authentication.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { FindUserDto } from './dtos/find-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) throw new NotFoundException('User not found!');
    return user;
  }

  @Get()
  @UseGuards(JwtAuthenticationGuard, RolesGuard)
  find(@Query() body: FindUserDto) {
    return this.usersService.find(body);
  }

  // @Post('/changePassword')
  // @UseGuards(JwtAuthenticationGuard, RolesGuard)
  // changePassword(@CurrentUser() user: User, @Body() parram: ResetPasswordDto) {
  //   return this.usersService.changePassword(user, parram);
  // }

  // @Serialize(UserDto)
  // @Delete('/:id')
  // // @Roles(Role.ADMIN)
  // @UseGuards(JwtAuthenticationGuard, RolesGuard)
  // deleteById(@Param('id') id: string, @CurrentUser() user: User) {
  //   if (user.roles !== Role.ADMIN && user.id !== parseInt(id)) {
  //     throw new ForbiddenException('Dont have permission to update user!');
  //   }
  //   return this.usersService.remove(parseInt(id));
  // }

  // @Patch('/:id')
  // @Roles(Role.ADMIN, Role.USER)
  // @UseGuards(JwtAuthenticationGuard, RolesGuard)
  // async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto, @CurrentUser() user: User) {
  //   if (user.roles !== Role.ADMIN && user.id !== parseInt(id)) {
  //     throw new ForbiddenException('Dont have permission to update user!');
  //   }
  //   if (user.roles !== Role.ADMIN) {
  //     body.roles = undefined;
  //   }
  //   return this.usersService.update(parseInt(id), body);
  // }

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
function CurrentUser() {
  throw new Error('Function not implemented.');
}

