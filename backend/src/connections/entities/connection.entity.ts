import { IsString, Length } from "class-validator";
import { CreateDateColumn, Entity, OneToOne, PrimaryColumn } from "typeorm";

import { User } from "../../users/entities/user.entity";

@Entity()
export class Connection {
    @CreateDateColumn()
    createdAt: Date;

    @PrimaryColumn({ length: 32 })
    @IsString()
    @Length(4, 12)
    id: string;

    @OneToOne(() => User, (user) => user.connection)
    user: User;
}
