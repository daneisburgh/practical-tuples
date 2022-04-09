import { Injectable, CanActivate, ExecutionContext, BadRequestException } from "@nestjs/common";

import { DevicesService } from "../devices.service";

@Injectable()
export class DeviceUserGuard implements CanActivate {
    constructor(private devicesService: DevicesService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const {
            params: { id },
            user
        } = context.switchToHttp().getRequest();

        const device = await this.devicesService.findOne(id);

        if (!device) {
            throw new BadRequestException("Invalid device");
        } else if (!user.devices.find((d) => d.id === device.id)) {
            throw new BadRequestException("Invalid device user");
        } else {
            return true;
        }
    }
}
