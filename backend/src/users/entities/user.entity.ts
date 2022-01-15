import { Exclude } from "class-transformer";
import { IsString, MaxLength } from "class-validator";
import {
    Column,
    UpdateDateColumn,
    CreateDateColumn,
    Entity,
    AfterLoad,
    OneToOne,
    JoinColumn,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable
} from "typeorm";

import { Connection } from "../../connections/entities/connection.entity";
import { Tuple } from "../../tuples/entities/tuple.entity";

@Entity()
export class User {
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 32, nullable: true, select: false, unique: true })
    @Exclude({ toPlainOnly: true })
    @IsString()
    @MaxLength(32)
    connectionId?: string;

    @OneToOne(() => Connection, (connection) => connection.user, {
        eager: true,
        onDelete: "SET NULL"
    })
    @JoinColumn()
    @Exclude({ toPlainOnly: true })
    connection?: Connection;

    @ManyToMany(() => Tuple, (Tuple) => Tuple.users)
    @JoinTable()
    tuples?: Tuple[];

    requestId: string;
    isOnline: boolean;

    @AfterLoad()
    setVariables() {
        this.isOnline = !!this.connection;
    }
}
