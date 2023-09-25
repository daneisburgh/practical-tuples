import { Injectable, CanActivate, ExecutionContext, BadRequestException } from "@nestjs/common";

import { FriendRequestsService } from "../friend-requests.service";

@Injectable()
export class FriendRequesteeUserGuard implements CanActivate {
    constructor(private friendRequestsService: FriendRequestsService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const {
            params: { id },
            user
        } = context.switchToHttp().getRequest();

        const friendRequest = await this.friendRequestsService.findOne(id);

        if (!friendRequest) {
            throw new BadRequestException("Invalid friend request");
        } else if (friendRequest.requestee.id !== user.id) {
            throw new BadRequestException("Invalid requestee");
        } else {
            return true;
        }
    }
}
