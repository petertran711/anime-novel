import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class TagSearchLog {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    tagName: string;

    @Column()
    tagUniqueName: string;
    
    @CreateDateColumn({ type: 'timestamp', nullable: true })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updatedAt: Date;
}
