import { IsNumber, IsString, Max, MaxLength, Min } from "class-validator";
import {
    Column,
    UpdateDateColumn,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    ManyToMany,
    JoinTable,
    OneToMany,
    AfterLoad
} from "typeorm";

import { Device } from "../../devices/entities/device.entity";
import { Tuple } from "../../tuples/entities/tuple.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt: Date;

    @Column({ nullable: true, unique: true })
    @IsString()
    @MaxLength(12)
    username: string;

    @Column({ nullable: false, default: 2 })
    @IsNumber()
    @Min(1)
    @Max(3)
    maxDevices: number;

    @OneToMany(() => Device, (device) => device.user, { cascade: true })
    devices: Device[];

    @ManyToMany(() => Tuple, (Tuple) => Tuple.users)
    @JoinTable()
    tuples?: Tuple[];

    requestId: string;
    isOnline: boolean;

    @AfterLoad()
    setVariables() {
        this.isOnline = this.devices && !!this.devices.find((device) => device.connectionId);
    }
}
