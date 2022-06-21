import { Novel } from 'src/novel/entities/novel.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
@Entity({
  orderBy: {
    id: 'DESC',
  },
})
export class Chapter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  episode: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true, unique: true })
  uniqueName: string;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  content: string;

  @ManyToOne(() => Novel, (n) => n.chapters)
  novel: Novel;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
