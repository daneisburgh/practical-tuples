import { Injectable, CanActivate, ExecutionContext, BadRequestException } from "@nestjs/common";
import { AES, enc } from "crypto-js";

import { UsersService } from "../users.service";

@Injectable()
export class UserGuard implements CanActivate {
    constructor(private usersService: UsersService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const connectionId = request.headers["connection-id"];
        const deviceId = request.headers["device-id"];
        const requestId = request.headers["request-id"];

        if (!connectionId || !requestId) {
            throw new BadRequestException("Invalid request");
        }

        const id = decryptRequestId(requestId);
        const user = await this.usersService.findOne({ id });

        if (
            !user ||
            !user.devices.find(
                (device) =>
                    device.id === deviceId &&
                    device.connectionId === connectionId &&
                    device.isVerified
            )
        ) {
            throw new BadRequestException("Invalid user");
        } else {
            request.user = user;
            return true;
        }
    }
}

export const decryptRequestId = (requestId: string) => {
    return parseInt(AES.decrypt(requestId, process.env.API_KEY).toString(enc.Utf8));
};
