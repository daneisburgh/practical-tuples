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
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    @IsString()
    value: string;

    @Column()
    @IsNumber()
    tupleId: number;

    @ManyToOne(() => Tuple, (tuple) => tuple.tupleItems, { eager: true })
    tuple: Tuple;
}
