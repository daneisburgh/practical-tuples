import { IsEnum, IsString } from "class-validator";
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

    @Column({ nullable: false, default: "New Tuple" })
    @IsString()
    name: string;

    @Column({ type: "enum", enum: TupleType, nullable: false, default: TupleType.list })
    @IsEnum(TupleType)
    type: TupleType;

    @ManyToOne(() => User, { eager: true })
    creator: User;

    @ManyToMany(() => User, (user) => user.tuples, { eager: true })
    users: User[];

    @OneToMany(() => TupleItem, (tupleItem) => tupleItem.tuple)
    tupleItems: TupleItem[];
}
