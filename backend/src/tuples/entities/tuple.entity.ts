import { IsEnum, IsString, MaxLength } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToMany,
    ManyToOne,
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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ nullable: false, length: 20, default: "New Tuple" })
    @IsString()
    @MaxLength(20)
    name: string;

    @Column({ type: "enum", enum: TupleType, nullable: false, default: TupleType.list })
    @IsEnum(TupleType)
    type: TupleType;

    @ManyToOne(() => User)
    creator: User;

    @ManyToMany(() => User, (user) => user.tuples, { onDelete: "CASCADE" })
    users: User[];

    @OneToMany(() => TupleItem, (tupleItem) => tupleItem.tuple)
    tupleItems: TupleItem[];
}
