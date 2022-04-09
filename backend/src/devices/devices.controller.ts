import {
    Controller,
    Post,
    Headers,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
    Body,
    Delete,
    Param,
    Patch
} from "@nestjs/common";

import { DevicesService } from "./devices.service";
import { CreateDeviceDto } from "./dto/create-device.dto";
import { UpdateDeviceDto } from "./dto/update-device.dto";
import { DeviceUserGuard } from "./guards/device-user.guard";
import { ConnectionGuard } from "../users/guards/connection.guard";
import { UserGuard } from "../users/guards/user.guard";

@Controller("devices")
@UseInterceptors(ClassSerializerInterceptor)
export class DevicesController {
    constructor(private readonly devicesService: DevicesService) {}

    @Post()
    @UseGuards(ConnectionGuard)
    create(
        @Headers("connection-id") connectionId: string,
        @Headers("device-id") deviceId: string,
        @Body() createDeviceDto: CreateDeviceDto
    ) {
        return this.devicesService.create(connectionId, deviceId, createDeviceDto);
    }

    @Delete(":id")
    @UseGuards(UserGuard)
    delete(@Param("id") id: string) {
        return this.devicesService.delete(id);
    }

    @Patch(":id")
    @UseGuards(UserGuard, DeviceUserGuard)
    update(@Param("id") id: string, @Body() updateDeviceDto: UpdateDeviceDto) {
        return this.devicesService.update(id, updateDeviceDto);
    }
}
