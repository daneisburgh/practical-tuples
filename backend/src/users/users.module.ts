import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "./entities/user.entity";
import { ConnectionsModule } from "../connections/connections.module";
import { Device } from "../devices/entities/device.entity";
import { Tuple } from "../tuples/entities/tuple.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Device, Tuple, User]), ConnectionsModule],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService]
})
export class UsersModule {}
