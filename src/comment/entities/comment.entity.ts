import { Novel } from 'src/novel/entities/novel.entity';
import { User } from 'src/users/user.entity';
import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {IsInt, Max, Min} from "class-validator";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  content: string;

  @Column()
  @IsInt()
  @Min(1)
  @Max(5)
  rate: number;

  @ManyToOne(() => Novel, (n) => n.comments)
  novel: Novel;

  @ManyToOne(() => User, (n) => n.comments)
  user: User;

  @ManyToOne(() => Comment, (n) => n.id)
  parent: Comment;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
