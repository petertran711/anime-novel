import {
  Body,
  Controller, ForbiddenException, Get, HttpCode, HttpStatus, Logger, Post,
  Req, Res, Session,
  UseGuards
} from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { CreateUserDto } from 'src/users/dtos/create-user.dto';
import { ResetPasswordDto } from 'src/users/dtos/reset-password.dto';
import { User } from 'src/users/user.entity';
import { getRepository } from 'typeorm';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dtos/forgotPassword.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import JwtAuthenticationGuard from './guards/jwt-authentication.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import RequestWithUser from './requestWithUser.interface';

@ApiTags('authentication')
// @ApiBearerAuth('access-token')
@Controller('auth')
// @Serialize(UserDto)
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(201)
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.register(body);

    this.authService.sendVerifyEmail(user.id).catch((e) => {
      Logger.warn('Error sending verification email');
    });

    session.userId = user.id;
    return user;
  }

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @ApiBody({
    type: LoginUserDto,
  })
  @Post('/login')
  async logIn(@Req() request: RequestWithUser, @Res() response: Response) {
    const { user } = request;
    const currentUser = await getRepository(User).findOne({ where: { id: user.id } });
    if (currentUser.isDelete) {
      throw new ForbiddenException('Tài khoản của bạn đã bị xoá');
    }
    const token = await this.authService.getCookieWithJwtToken(currentUser);
    response.setHeader('authorization', 'Bearer ' + token.access_token);
    return response.send(token);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    // response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    response.setHeader('authorization', null);
    return response.sendStatus(200);
  }

  @Post('/facebook/login')
  async signinWithFacebook(@Body() body: LoginUserDto, @Req() request, @Res() response: Response) {
    const user = await this.authService.signinWithSocialAccount('facebook', body.access_token);
    console.log('login facek', user);
    const token = await this.authService.getCookieWithJwtToken(user);
    response.setHeader('authorization', 'Bearer ' + token.access_token);
    return response.send(token);
  }

  @Get('/facebook')
  @UseGuards(PassportAuthGuard('facebook'))
  async facebookLogin(): Promise<any> {
    return HttpStatus.OK;
  }

  @Get('/facebook/redirect')
  @UseGuards(PassportAuthGuard('facebook'))
  async facebookLoginRedirect(@Req() request, @Res() response: Response): Promise<any> {
    const user = await this.authService.signinWithSocialAccount('facebook', request.user.accessToken);
    request.user = user;
    return this.logIn(request, response);
  }

  @HttpCode(200)
  @Post('/forgotPassword')
  async forgotPassword(@Req() req: Request, @Body() data: ForgotPasswordDto): Promise<any> {
    return this.authService.forgotPassword(data.email, req.hostname);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthenticationGuard)
  @Post('/resetPassword')
  async resetPassword(@CurrentUser() user: User, @Body() resetPasswordDto: ResetPasswordDto) {
    console.log('user', user);
    return this.authService.resetPassword(user, resetPasswordDto.password);
  }

  @Post('/verifyToken')
  async verifyToken( @Body() token: string) {
    return this.authService.verifyToken(token);
  }

}
