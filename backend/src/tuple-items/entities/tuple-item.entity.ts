import { Exclude } from "class-transformer";
import { IsBoolean, IsNumber, IsString, MaxLength } from "class-validator";
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
    @IsNumber()
    id: number;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt: Date;

    @Column({ nullable: false, length: 20, default: "New item" })
    @IsString()
    @MaxLength(20)
    name: string;

    @Column({ nullable: false })
    @IsNumber()
    order: number;

    @Column({ nullable: false, default: false })
    @IsBoolean()
    isChecked: boolean;

    @Column()
    @IsNumber()
    @Exclude({ toPlainOnly: true })
    tupleId: number;

    @ManyToOne(() => Tuple, (tuple) => tuple.tupleItems, { onDelete: "CASCADE" })
    tuple: Tuple;
}
