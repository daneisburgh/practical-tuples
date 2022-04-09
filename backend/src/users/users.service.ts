import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AES } from "crypto-js";
import { Repository } from "typeorm";

import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User } from "./entities/user.entity";
import { ConnectionsService } from "../connections/connections.service";
import { Device } from "../devices/entities/device.entity";
import { Tuple } from "../tuples/entities/tuple.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Device)
        private devicesRepository: Repository<Device>,
        @InjectRepository(Tuple)
        private tuplesRepository: Repository<Tuple>,
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private connectionsService: ConnectionsService
    ) {}

    findOne(conditions: { id?: number; username?: string }) {
        return this.usersRepository.findOne(conditions, {
            relations: [
                "devices",
                "devices.connection",
                "tuples",
                "tuples.tupleItems",
                "tuples.users"
            ]
        });
    }

    async create(connectionId: string, deviceId: string, createUserDto: CreateUserDto) {
        const device = Object.assign(new Device(), {
            id: deviceId,
            isVerified: true,
            info: createUserDto.deviceInfo,
            connectionId
        });

        const { id } = await this.usersRepository.save({
            devices: [device]
        });

        await this.usersRepository.update(id, { username: "User" + id });
        const user = await this.findOne({ id });
        return { ...user, requestId: this.getRequestId(user) };
    }

    async delete(user: User) {
        for (const tuple of user.tuples) {
            if (tuple.users.length === 1) {
                await this.tuplesRepository.delete(tuple.id);
            }
        }

        await this.notifyConnections(user, { deleteUser: user });
        await this.usersRepository.delete(user.id);
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const { username } = updateUserDto;

        if (username) {
            const user = await this.findOne({ username });

            if (user) {
                throw new BadRequestException("Username is taken");
            } else if (username.toLowerCase().startsWith("user")) {
                throw new BadRequestException("New username cannot start with 'User'");
            }
        }

        await this.usersRepository.update(id, updateUserDto);
        const user = await this.findOne({ id });
        await this.notifyConnections(user, { updateUser: user });
        return user;
    }

    async connect(user: User, connectionId: string, deviceId: string) {
        const device = user.devices.find((device) => device.id === deviceId);
        await this.devicesRepository.update(deviceId, { connectionId });

        if (device.isVerified) {
            return this.findOne({ id: user.id });
        }
    }

    getRequestId(user: User) {
        return AES.encrypt(user.id.toString(), process.env.API_KEY).toString();
    }

    private async notifyConnections(user: User, data: object) {
        for (const connectionId of user.devices.map((d) => d.connectionId)) {
            await this.connectionsService.postToConnection(connectionId, { user: data });
        }
    }
}
