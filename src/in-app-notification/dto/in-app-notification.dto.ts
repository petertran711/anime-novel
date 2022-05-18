import { OmitType } from '@nestjs/swagger';
import { InAppNotification } from '../entities/in-app-notification.entity';

export class InAppNotificationDto extends OmitType(InAppNotification, ['id', 'user']) {
  user: {
    id: number;
  };
}
