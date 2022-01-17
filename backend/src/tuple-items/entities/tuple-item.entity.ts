import { Exclude } from "class-transformer";
import { IsNumber, IsString } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

import { Tuple } from "../../tuples/entities/tuple.entity";

@Entity()
export class TupleItem {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ nullable: false })
    @IsString()
    value: string;

    @Column()
    @IsNumber()
    @Exclude({ toPlainOnly: true })
    tupleId: number;

    @ManyToOne(() => Tuple, (tuple) => tuple.tupleItems, { eager: true })
    tuple: Tuple;
}
