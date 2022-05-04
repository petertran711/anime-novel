import {
  Column,
  CreateDateColumn,
  Entity, PrimaryGeneratedColumn,
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

  @Column({ nullable: true })
  fullName: string;

  @Column({ nullable: true, unique: true })
  phoneNumber: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isBuyCourse: boolean;

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

  // @Column('simple-array', { nullable: true })
  // favoriteCourse: number[];

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
