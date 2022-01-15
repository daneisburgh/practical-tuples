import { Module } from "@nestjs/common";
import { TupleItemsService } from "./tuple-items.service";
import { TupleItemsController } from "./tuple-items.controller";

@Module({
    controllers: [TupleItemsController],
    providers: [TupleItemsService]
})
export class TupleItemsModule {}
