import { Module } from '@nestjs/common';
import { InAppNotificationService } from './in-app-notification.service';
import { InAppNotificationController } from './in-app-notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InAppNotification } from './entities/in-app-notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InAppNotification])],
  controllers: [InAppNotificationController],
  providers: [InAppNotificationService],
})
export class InAppNotificationModule {}
