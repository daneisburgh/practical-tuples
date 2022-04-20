import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TuplesService } from "./tuples.service";
import { TuplesController } from "./tuples.controller";
import { Tuple } from "./entities/tuple.entity";
import { UsersModule } from "../users/users.module";
import { ConnectionsModule } from "../connections/connections.module";
import { TupleItem } from "../tuple-items/entities/tuple-item.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Tuple, TupleItem]), ConnectionsModule, UsersModule],
    controllers: [TuplesController],
    providers: [TuplesService],
    exports: [TuplesService]
})
export class TuplesModule {}
