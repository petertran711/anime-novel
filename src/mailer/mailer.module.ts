import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerController } from './mailer.controller';
import { MailmanModule } from '@squareboat/nest-mailman';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailmanModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          host: 'in-v3.mailjet.com',
          port: 587,
          username: 'e9d856da89c6153865390f8e5b98e052',
          password: '397f87a4472611c1d3431bbcef02374f',
          from: 'thewolves.vippro@gmail.com',
          path: '/your-project-path/resources/mails'
        }
      }
    }),
  ],
  controllers: [MailerController],
  providers: [MailerService],
  exports: [MailerService]
})
export class MailerModule {}