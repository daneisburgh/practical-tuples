import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { TupleItemsService } from "./tuple-items.service";
import { TupleItemsController } from "./tuple-items.controller";
import { TupleItem } from "./entities/tuple-item.entity";
import { TuplesModule } from "../tuples/tuples.module";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [TypeOrmModule.forFeature([TupleItem]), TuplesModule, UsersModule],
    controllers: [TupleItemsController],
    providers: [TupleItemsService]
})
export class TupleItemsModule {}
