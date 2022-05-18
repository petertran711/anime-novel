import { IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { InAppNotification } from '../entities/in-app-notification.entity';
import { InAppNotificationDto } from './in-app-notification.dto';

export class CreateInAppNotificationDto extends IntersectionType(
  OmitType(PartialType(InAppNotificationDto), ['createdAt', 'updatedAt']),
  PickType(InAppNotification, ['title']),
) {}
