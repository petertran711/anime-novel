import { Injectable } from '@nestjs/common';
import { Mailman, MailMessage } from '@squareboat/nest-mailman';
import { User } from 'src/users/user.entity';

@Injectable()
export class MailerService {
  async sendWelcomeEmail(email: string) {
    const mail = MailMessage.init()
      .subject('Welcome new member to E-learning platform')
      .greeting('Hello,')
      .line('Welcome to COMATEK-ELEARNING platform. We’re thrilled to see you here!')
      .action('Visit our platform now!', 'https://www.google.com')
      .line('We’re confident that E-learning will help you boost your knowledge.');

    return await Mailman.init().to(email).send(mail);
  }

  async sendVerificationEmail(email: string, verifyUrl: string) {
    const mail = MailMessage.init()
      .subject('Verify your E-learning platform account')
      .greeting('Hello,')
      .line('Welcome to COMATEK-ELEARNING platform. We’re thrilled to see you here!')
      .action('Verify my account now!', verifyUrl);

    return await Mailman.init().to(email).send(mail);
  }

  async sendResetPasswordEmail(email: string, verifyUrl: string) {
    const token = 'adadad';
    const mail = MailMessage.init()
      .subject('Reset password request')
      .greeting('Hello,')
      .line(`You just request to reset password. Your token is : ${token}`)
      .action('Verify my account now!', verifyUrl);

    return await Mailman.init().to(email).send(mail);
  }

  async sendSuccessResetPassEmail(email: string) {
    const token = 'adadad';
    const mail = MailMessage.init()
      .subject('Reset password Success')
      .greeting('Hello,')
      .line(`You password was changed successfully`);
    return await Mailman.init().to(email).send(mail);
  }

  async sendForgotPassword(user: User, token: string, hostname: string) {
    const domain = hostname.toString().includes('uat')
      ? 'https://client.uat.elearning.viziple.com/reset-password'
      : 'https://client.dev.elearning.viziple.com/reset-password';
    const url = domain + '?token=' + token;
    const mail = MailMessage.init()
      .subject('Forgot password request')
      .greeting(`Hello, ${user.username}`)
      .line(`Please click this link to reset password ${url}`);
    return await Mailman.init().to(user.email).send(mail);
  }

  async sendReferUserNotify(user: User) {
    const mail = MailMessage.init()
      .subject('Người dùng đăng ký chuỗi')
      .greeting(`Hello, ${user.fullName}`)
      .line(`Có người dùng mới tham gia vào chuỗi của bạn`);
    return await Mailman.init().to(user.email).send(mail);
  }
}
