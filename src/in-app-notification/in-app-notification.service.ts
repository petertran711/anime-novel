import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { getRepository, Repository } from 'typeorm';
import { CreateInAppNotificationDto } from './dto/create-in-app-notification.dto';
import { FindInAppNotificationDto } from './dto/find-in-app-notification.dto';
import { UpdateInAppNotificationDto } from './dto/update-in-app-notification.dto';
import { InAppNotification } from './entities/in-app-notification.entity';

@Injectable()
export class InAppNotificationService {
  constructor(@InjectRepository(InAppNotification) private notificationRepository: Repository<InAppNotification>) {}

  async create(createInAppNotificationDto: CreateInAppNotificationDto) {
    const notifcation = this.notificationRepository.create(createInAppNotificationDto);
    return this.notificationRepository.save(notifcation);
  }

  async findAll({ userId, isRead, skip, limit }: FindInAppNotificationDto) {
    const notifications = this.notificationRepository
      .createQueryBuilder('notification')
      .orderBy('notification.createdAt', 'DESC');
    if (userId) {
      notifications.andWhere(`user.id = :id`, { id: userId });
    }
    if (isRead) {
      if (isRead.toString() === 'true') {
        notifications.andWhere('notification.isRead = 1');
      } else if (isRead.toString() === 'false') {
        notifications.andWhere('notification.isRead = 0');
      }
    }
    return notifications.getManyAndCount();
  }

  async getCountUnRead({ userId }: FindInAppNotificationDto) {
    const count = await this.notificationRepository.count({
      where: {
        user: {
          id: userId,
        },
        isRead: false,
      },
    });
    return count;
  }

  async update(id: number, updateInAppNotificationDto: UpdateInAppNotificationDto) {
    const existed = await this.notificationRepository.findOne(id);
    if (!existed) {
      throw new NotFoundException('Notification does note existed');
    }
    // const update = Object.assign({}, existed, updateInAppNotificationDto);
    return this.notificationRepository.update(id, updateInAppNotificationDto);
  }

  remove(id: number) {
    return this.notificationRepository.delete(id);
  }
  async readAll(userId: number) {
    const existedUser = await getRepository(User).findOne({
      where: {
        id: userId,
      },
    });
    if (!existedUser) {
      throw new NotFoundException('User không tồn tại');
    }
    return getRepository(InAppNotification)
      .createQueryBuilder()
      .update()
      .set({ isRead: true })
      .where(`userId = :userId`, { userId })
      .execute();
  }
}
