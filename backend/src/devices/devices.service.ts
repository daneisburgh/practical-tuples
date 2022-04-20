import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateDeviceDto } from "./dto/create-device.dto";
import { UpdateDeviceDto } from "./dto/update-device.dto";
import { Device } from "./entities/device.entity";
import { ConnectionsService } from "../connections/connections.service";
import { UsersService } from "../users/users.service";

@Injectable()
export class DevicesService {
    constructor(
        @InjectRepository(Device)
        private devicesRepository: Repository<Device>,
        private connectionsService: ConnectionsService,
        private usersService: UsersService
    ) {}

    async create(createDeviceDto: CreateDeviceDto, connectionId: string, deviceId: string) {
        const { deviceInfo, username } = createDeviceDto;
        const user = await this.usersService.findOne({ username });

        if (!user) {
            throw new BadRequestException("Username not found");
        } else if (user.devices.find((d) => d.id === deviceId)) {
            throw new BadRequestException("Device already associated with account");
        } else if (user.devices.length === user.maxDevices) {
            throw new BadRequestException("Account has maximum allowed devices");
        }

        await this.devicesRepository.save({
            id: deviceId,
            connectionId,
            info: deviceInfo,
            user
        });

        const device = await this.findOne(deviceId);
        await this.notifyConnections(device, connectionId, { createDevice: device });
        return { requestId: this.usersService.getRequestId(user) };
    }

    async delete(id: string, connectionId: string) {
        const device = await this.findOne(id);

        if (!device) {
            throw new BadRequestException("Device not found");
        }

        await this.devicesRepository.delete(device.id);
        await this.notifyConnections(device, connectionId, { deleteDevice: device });
    }

    async findOne(id: string) {
        return this.devicesRepository.findOne(id, {
            relations: ["connection", "user", "user.devices"]
        });
    }

    async update(id: string, updateDeviceDto: UpdateDeviceDto, connectionId: string) {
        if (!(await this.devicesRepository.findOne(id))) {
            throw new BadRequestException("Device not found");
        }

        await this.devicesRepository.update(id, updateDeviceDto);
        const device = await this.findOne(id);
        await this.notifyConnections(device, connectionId, { updateDevice: device });
        return device;
    }

    private async notifyConnections(device: Device, connectionId: string, data: object) {
        for (const id of device.user.devices
            .filter((d) => d.connectionId !== connectionId && d.isVerified)
            .map((d) => d.connectionId)) {
            await this.connectionsService.postToConnection(id, { device: data });
        }
    }
}
