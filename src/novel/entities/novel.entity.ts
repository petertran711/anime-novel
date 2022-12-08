import { Category } from 'src/category/entities/category.entity';
import { Chapter } from 'src/chapter/entities/chapter.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Rate } from 'src/rate/entities/rate.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
@Entity()
export class Novel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true, unique: true })
  uniqueName: string;

  @Column({ nullable: true, type: 'longtext' })
  description: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  views: number;

  @Column({ nullable: true })
  author: string;

  @Column({ nullable: true })
  rank: string;

  @Column({ nullable: true })
  bookmarked: number;

  @Column({ nullable: true })
  status: string;

  @Column({ nullable: true })
  getChapters: string;

  @Column({ nullable: true })
  sourceLink: string;

  @Column({ nullable: true })
  active: boolean;

  @ManyToMany(() => Category, (cat) => cat.novels)
  @JoinTable()
  categories: Category[];

  @ManyToMany(() => Tag, (tag) => tag.novels)
  @JoinTable()
  tags: Tag[];

  @OneToMany(() => Chapter, (c) => c.novel)
  chapters: Chapter[];

  @OneToMany(() => Comment, (c) => c.novel)
  comments: Comment[];

  @OneToMany(() => Rate, (c) => c.novel)
  rates: Rate[];

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
