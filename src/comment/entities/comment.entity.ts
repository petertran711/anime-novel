import { Novel } from 'src/novel/entities/novel.entity';
import { User } from 'src/users/user.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  content: string;

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
