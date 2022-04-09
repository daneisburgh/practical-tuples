import { IsString, Length } from "class-validator";
import { CreateDateColumn, Entity, OneToOne, PrimaryColumn } from "typeorm";

import { Device } from "../../devices/entities/device.entity";

const connectionIdLength = 32;

@Entity()
export class Connection {
    @PrimaryColumn({ length: connectionIdLength })
    @Length(1, connectionIdLength)
    @IsString()
    id: string;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date;

    @OneToOne(() => Device, (device) => device.connection)
    device: Device;
}
