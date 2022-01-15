import { Injectable, CanActivate, ExecutionContext, BadRequestException } from "@nestjs/common";

import { UsersService } from "../users.service";

@Injectable()
export class UserConnectionGuard implements CanActivate {
    constructor(private usersService: UsersService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const { headers } = context.switchToHttp().getRequest();
        const connectionId = headers["connection-id"];

        const user = await this.usersService.findOne({ connectionId });

        if (!!user) {
            return true;
        } else {
            throw new BadRequestException("Invalid connection");
        }
    }
}
