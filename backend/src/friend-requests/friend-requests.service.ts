import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateFriendRequestDto } from "./dto/create-friend-request.dto";
import { UpdateFriendRequestDto } from "./dto/update-friend-request.dto";
import { FriendRequest } from "./entities/friend-request.entity";
import { ConnectionsService } from "../connections/connections.service";
import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entity";

@Injectable()
export class FriendRequestsService {
    constructor(
        @InjectRepository(FriendRequest)
        private friendRequestsRepository: Repository<FriendRequest>,
        private connectionsService: ConnectionsService,
        private usersService: UsersService
    ) {}

    async create(
        createFriendRequestDto: CreateFriendRequestDto,
        connectionId: string,
        requester: User
    ) {
        const { username } = createFriendRequestDto;
        const requestee = await this.usersService.findOne({ username });

        if (!requestee) {
            throw new BadRequestException("Username not found");
        } else if (requester.friendRequestsSent.find((f) => f.requestee.id === requestee.id)) {
            throw new BadRequestException("Friend request already sent");
        } else if (requester.friends.find((f) => f.username === requestee.username)) {
            throw new BadRequestException("User is already a friend");
        } else if (requestee.friends.length === requestee.maxFriends) {
            throw new BadRequestException("User's account has maximum allowed friends");
        } else if (requester.friends.length === requester.maxFriends) {
            throw new BadRequestException("Account has maximum allowed friends");
        }

        const { id } = await this.friendRequestsRepository.save({ requestee, requester });

        const friendRequest = await this.findOne(id);
        await this.notifyConnections(friendRequest, connectionId, {
            createFriendRequest: friendRequest
        });
        return friendRequest;
    }

    async delete(id: number, connectionId: string) {
        const friendRequest = await this.findOne(id);

        if (!friendRequest) {
            throw new BadRequestException("Friend request not found");
        }

        await this.friendRequestsRepository.delete(friendRequest.id);
        await this.notifyConnections(friendRequest, connectionId, {
            deleteFriendRequest: friendRequest
        });
    }

    async update(id: number, updateFriendRequestDto: UpdateFriendRequestDto, connectionId: string) {
        if (!(await this.friendRequestsRepository.findOne(id))) {
            throw new BadRequestException("Friend request not found");
        }

        await this.friendRequestsRepository.update(id, updateFriendRequestDto);
        const friendRequest = await this.findOne(id);
        await this.notifyConnections(friendRequest, connectionId, {
            updateFriendRequest: friendRequest
        });
        return friendRequest;
    }

    async findOne(id: number) {
        return this.friendRequestsRepository.findOne(id, {
            relations: ["requestee", "requestee.devices", "requester", "requester.devices"]
        });
    }

    private async notifyConnections(
        friendRequest: FriendRequest,
        connectionId: string,
        data: object
    ) {
        for (const id of friendRequest.requestee.devices
            .concat(friendRequest.requester.devices)
            .filter((d) => d.connectionId !== connectionId && d.isVerified)
            .map((d) => d.connectionId)) {
            await this.connectionsService.postToConnection(id, { friendRequest: data });
        }
    }
}
