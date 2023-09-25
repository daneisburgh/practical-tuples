import { Exclude } from "class-transformer";
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
import {
    FriendRequest,
    FriendRequestStatus
} from "../../friend-requests/entities/friend-request.entity";
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
    @MaxLength(9)
    username: string;

    @Column({ nullable: false, default: 2 })
    @IsNumber()
    @Min(1)
    @Max(5)
    maxDevices: number;

    @Column({ nullable: false, default: 2 })
    @IsNumber()
    @Min(0)
    @Max(10)
    maxFriends: number;

    @OneToMany(() => Device, (device) => device.user, { cascade: true })
    devices: Device[];

    @OneToMany(() => FriendRequest, (friend) => friend.requestee, { cascade: true })
    @Exclude()
    friendRequestsReceived: FriendRequest[];

    @OneToMany(() => FriendRequest, (friend) => friend.requester, { cascade: true })
    @Exclude()
    friendRequestsSent: FriendRequest[];

    @ManyToMany(() => Tuple, (Tuple) => Tuple.users)
    @JoinTable()
    tuples?: Tuple[];

    friends: (Pick<FriendRequest, "id" | "updatedAt"> & Pick<User, "username">)[];
    friendRequests: FriendRequest[];
    isOnline: boolean;
    requestId: string;

    @AfterLoad()
    setVariables() {
        this.friends = [];
        this.friendRequests = [];
        this.friendRequestsReceived = this.friendRequestsReceived ?? [];
        this.friendRequestsSent = this.friendRequestsSent ?? [];
        this.isOnline = this.devices && !!this.devices.find((device) => device.connectionId);

        for (const friendRequest of this.friendRequestsReceived.concat(this.friendRequestsSent)) {
            const { id, requestee, requester, status, updatedAt } = friendRequest;

            if (status === FriendRequestStatus.accepted) {
                const { username } = this.id === requestee.id ? requester : requestee;
                this.friends.push({
                    id,
                    updatedAt,
                    username
                });
            } else {
                this.friendRequests.push(friendRequest);
            }
        }
    }
}
