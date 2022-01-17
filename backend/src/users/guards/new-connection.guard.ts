import { Injectable, CanActivate, ExecutionContext, BadRequestException } from "@nestjs/common";

import { ConnectionsService } from "../../connections/connections.service";
import { UsersService } from "../users.service";

@Injectable()
export class NewConnectionGuard implements CanActivate {
    constructor(
        private connectionService: ConnectionsService,
        private usersService: UsersService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const {
            body: { connectionId }
        } = context.switchToHttp().getRequest();

        const connection = await this.connectionService.findOne(connectionId);
        const user = await this.usersService.findOne({ connectionId });

        if (!connection) {
            throw new BadRequestException("Connection does not exist");
        } else if (user) {
            throw new BadRequestException("Connection is not available");
        } else {
            return true;
        }
    }
}
