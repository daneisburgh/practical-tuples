import { Exclude } from "class-transformer";
import { IsBoolean, IsNumber, IsObject, IsString, Length } from "class-validator";
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn
} from "typeorm";
import { DeviceInfo } from "@capacitor/device";

import { User } from "../../users/entities/user.entity";
import { Connection } from "../../connections/entities/connection.entity";

const deviceIdLength = 64;

@Entity()
export class Device {
    @PrimaryColumn({ length: deviceIdLength })
    @Length(1, deviceIdLength)
    @IsString()
    id: string;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date;

    @Column({ nullable: false, type: "json" })
    @IsObject()
    info: DeviceInfo;

    @Column({ nullable: false, default: false })
    @IsBoolean()
    isVerified: boolean;

    @Column({ nullable: true })
    @Exclude({ toPlainOnly: true })
    @IsString()
    connectionId: string;

    @OneToOne(() => Connection, (connection) => connection.device, { onDelete: "SET NULL" })
    @JoinColumn()
    @Exclude()
    connection: Connection;

    @Column({ nullable: false })
    @Exclude({ toPlainOnly: true })
    @IsNumber()
    userId: number;

    @ManyToOne(() => User, (user) => user.devices, { onDelete: "CASCADE" })
    user: User;
}
