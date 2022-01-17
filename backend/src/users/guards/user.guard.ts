import { Injectable, CanActivate, ExecutionContext, BadRequestException } from "@nestjs/common";
import { AES, enc } from "crypto-js";

import { UsersService } from "../users.service";

@Injectable()
export class UserGuard implements CanActivate {
    constructor(private usersService: UsersService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const requestId = request.headers["request-id"];

        if (!requestId) {
            throw new BadRequestException("Invalid request");
        }

        const id = parseInt(AES.decrypt(requestId, process.env.API_KEY).toString(enc.Utf8));
        const user = await this.usersService.findOne({ id });

        if (!user) {
            throw new BadRequestException("Invalid user");
        } else {
            request.user = user;
            return true;
        }
    }
}
