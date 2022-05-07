import { Novel } from 'src/novel/entities/novel.entity';
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, select: false })
  name: string;

  @Column({ nullable: true, select: false })
  description: string;

  @ManyToMany(() => Novel, (novel) => novel.categories)
  @JoinTable()
  novels: Novel[];

  @CreateDateColumn({ type: 'timestamp', nullable: true })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
