import { Category } from 'src/category/entities/category.entity';
import { Chapter } from 'src/chapter/entities/chapter.entity';
import { Tag } from 'src/tag/entities/tag.entity';
import { Column, CreateDateColumn, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
@Entity()
export class Novel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true})
  name: string;

  @Column({ nullable: true})
  description: string;

  @Column({ nullable: true})
  image: string;

  @Column({ nullable: true})
  views: number;

  @Column({ nullable: true})
  author: string;

  @Column({ nullable: true})
  rank: string;

  @Column({ nullable: true})
  bookmarked: number;

  @Column({ nullable: true})
  status: string;

  @ManyToMany(() => Tag, (tag) => tag.novels)
  categories: Category[];
  
  @OneToMany(() => Chapter, c => c.novel)
  chapters: Chapter[];

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
