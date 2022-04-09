import { Injectable, CanActivate, ExecutionContext, BadRequestException } from "@nestjs/common";

import { UsersService } from "../users.service";
import { decryptRequestId } from "./user.guard";

@Injectable()
export class UserConnectGuard implements CanActivate {
    constructor(private usersService: UsersService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const deviceId = request.headers["device-id"];
        const requestId = request.headers["request-id"];

        if (!deviceId || !requestId) {
            throw new BadRequestException("Invalid request");
        }

        const id = decryptRequestId(requestId);
        const user = await this.usersService.findOne({ id });

        if (!user) {
            throw new BadRequestException("Invalid user");
        } else if (!user.devices.find((device) => device.id === deviceId)) {
            throw new BadRequestException("Invalid device");
        } else {
            request.user = user;
            return true;
        }
    }
}
