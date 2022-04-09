import { Injectable, CanActivate, ExecutionContext, BadRequestException } from "@nestjs/common";

import { ConnectionsService } from "../../connections/connections.service";

@Injectable()
export class ConnectionGuard implements CanActivate {
    constructor(private connectionService: ConnectionsService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const connectionId = request.headers["connection-id"];
        const deviceId = request.headers["device-id"];

        const connection = await this.connectionService.findOne(connectionId);

        if (!connection) {
            throw new BadRequestException("Connection does not exist");
        } else if (connection.device && connection.device.id !== deviceId) {
            throw new BadRequestException("Connection is taken");
        } else {
            request.connection = connection;
            return true;
        }
    }
}
