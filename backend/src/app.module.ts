import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { getConnectionOptions } from "typeorm";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConnectionsModule } from "./connections/connections.module";
import { Connection } from "./connections/entities/connection.entity";
import { DevicesModule } from "./devices/devices.module";
import { Device } from "./devices/entities/device.entity";
import { TuplesModule } from "./tuples/tuples.module";
import { Tuple } from "./tuples/entities/tuple.entity";
import { TupleItemsModule } from "./tuple-items/tuple-items.module";
import { TupleItem } from "./tuple-items/entities/tuple-item.entity";
import { UsersModule } from "./users/users.module";
import { User } from "./users/entities/user.entity";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            useFactory: async () =>
                Object.assign(await getConnectionOptions(), {
                    entities: [Connection, Device, Tuple, TupleItem, User],
                    keepConnectionAlive: true
                })
        }),
        ConnectionsModule,
        UsersModule,
        TuplesModule,
        TupleItemsModule,
        DevicesModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
