import { Comment } from 'src/comment/entities/comment.entity';
import { InAppNotification } from 'src/in-app-notification/entities/in-app-notification.entity';
import { Rate } from 'src/rate/entities/rate.entity';
import {
  Column,
  CreateDateColumn,
  Entity, OneToMany, PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

@Entity({
  orderBy: {
    id: 'DESC',
  },
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
    nullable: true,
  })
  username: string;

  @Column({
    length: 100,
    unique: true,
  })
  email: string;

  @Column({ nullable: true, select: false })
  password: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true, unique: true })
  phoneNumber: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  activationCode: string;


  @Column({ type: 'date', nullable: true })
  birthday: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  secrectKey: string;

  @Column({ nullable: true, default: 'Ha Noi' })
  city: string;

  @Column({ default: false })
  isDelete: boolean;

  @Column({
    unique: true,
    nullable: true,
  })
  facebookId: string;

  @Column({
    unique: true,
    nullable: true,
  })
  googleId: string;

  @Column('simple-array', { nullable: true })
  bookmark: number[];

  @OneToMany(() => InAppNotification, (notification) => notification.user)
  notifications: InAppNotification[];

  @OneToMany(() => Rate, (c) => c.user)
  rates: Rate[];

  @OneToMany(() => Comment, (c) => c.user)
  comments:Comment [];
  
  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
