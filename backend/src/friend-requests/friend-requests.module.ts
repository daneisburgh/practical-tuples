import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { FriendRequestsService } from "./friend-requests.service";
import { FriendRequestsController } from "./friend-requests.controller";
import { FriendRequest } from "./entities/friend-request.entity";
import { ConnectionsModule } from "../connections/connections.module";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [TypeOrmModule.forFeature([FriendRequest]), ConnectionsModule, UsersModule],
    controllers: [FriendRequestsController],
    providers: [FriendRequestsService],
    exports: [FriendRequestsService]
})
export class FriendRequestsModule {}
