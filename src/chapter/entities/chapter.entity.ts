import { Novel } from 'src/novel/entities/novel.entity';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
@Entity()
export class Chapter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, select: false })
  name: string;

  @Column({ nullable: true, select: false })
  description: string;

  @Column({ nullable: true, select: false })
  image: string;

  @Column({ nullable: true, select: false })
  content: string;

  @ManyToOne(() => Novel, (n) => n.chapters)
  novel: Novel;

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
