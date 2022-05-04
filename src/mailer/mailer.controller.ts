import { Controller, Post, Body } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { SendMailDto } from './dto/send-mail.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('mailer')
@ApiBearerAuth('access-token')
@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Post('sendWelcomeEmail')
  sendWelcomeEmail(@Body() body: SendMailDto) {
    return this.mailerService.sendWelcomeEmail(body.email);
  }

  @Post('sendVerifyEmail')
  sendVerifyEmail(@Body() body: SendMailDto) {
    return this.mailerService.sendVerificationEmail(body.email, body.url);
  }

  
  @Post('sendResetPasswordEmail')
  sendResetPasswordEmail(@Body() body: SendMailDto) {
    return this.mailerService.sendResetPasswordEmail(body.email, body.url);
  }
}
