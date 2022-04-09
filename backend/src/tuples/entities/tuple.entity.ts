import { IsEnum, IsString, MaxLength } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";

import { TupleItem } from "../../tuple-items/entities/tuple-item.entity";
import { User } from "../../users/entities/user.entity";

enum TupleType {
    list = "List",
    checkbox = "Checkbox"
}

@Entity()
export class Tuple {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt: Date;

    @Column({ nullable: false, length: 20, default: "New tuple" })
    @IsString()
    @MaxLength(20)
    name: string;

    @Column({ type: "enum", enum: TupleType, nullable: false, default: TupleType.list })
    @IsEnum(TupleType)
    type: TupleType;

    @ManyToMany(() => User, (user) => user.tuples, { onDelete: "CASCADE" })
    users: User[];

    @OneToMany(() => TupleItem, (tupleItem) => tupleItem.tuple)
    tupleItems: TupleItem[];
}
