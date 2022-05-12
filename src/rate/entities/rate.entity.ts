import { Novel } from "src/novel/entities/novel.entity";
import { User } from "src/users/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Rate {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ nullable: true })
    rate: number;
  
    @ManyToOne(() => Novel, (n) => n.rates)
    novel: Novel;

    @ManyToOne(() => User, (n) => n.rates)
    user: User;
    
    @CreateDateColumn({ type: 'timestamp', nullable: true })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updatedAt: Date;
}
