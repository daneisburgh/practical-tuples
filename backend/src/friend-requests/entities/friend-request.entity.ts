import { IsEnum } from "class-validator";
import {
    UpdateDateColumn,
    CreateDateColumn,
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    Column
} from "typeorm";

import { User } from "../../users/entities/user.entity";

export enum FriendRequestStatus {
    accepted = "Accepted",
    rejected = "Rejected",
    pending = "Pending"
}

@Entity()
export class FriendRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt: Date;

    @Column({ type: "enum", enum: FriendRequestStatus, default: FriendRequestStatus.pending })
    @IsEnum(FriendRequestStatus)
    status: FriendRequestStatus;

    @ManyToOne(() => User, (user) => user.friends, { onDelete: "CASCADE", eager: true })
    requestee: User;

    @ManyToOne(() => User, (user) => user.friends, { onDelete: "CASCADE", eager: true })
    requester: User;
}
