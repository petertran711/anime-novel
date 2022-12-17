import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from "typeorm";
@Entity()
export class Google {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    domain: string;

    @Column({ nullable: true, type: 'longtext' })
    codeAnalytics: string;

    @Column({ nullable: true })
    codeAds: string;

    @CreateDateColumn({ type: 'timestamp', nullable: true })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp', nullable: true })
    updatedAt: Date;
}
