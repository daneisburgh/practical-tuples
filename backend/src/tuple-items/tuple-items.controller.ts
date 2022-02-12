import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";

import { TupleItemsService } from "./tuple-items.service";
import { CreateTupleItemDto } from "./dto/create-tuple-item.dto";
import { UpdateTupleItemDto } from "./dto/update-tuple-item.dto";
import { UpdateTupleItemsDto } from "./dto/update-tuple-items.dto";
import { TupleItemUserGuard } from "./guards/tuple-item-user.guard";
import { TupleUserGuard } from "./guards/tuple-user.guard";
import { UserConnectionGuard } from "../users/guards/user-connection.guard";
import { UserGuard } from "../users/guards/user.guard";

@Controller("tuple-items")
export class TupleItemsController {
    constructor(private readonly tupleItemsService: TupleItemsService) {}

    @Post()
    @UseGuards(UserGuard, UserConnectionGuard, TupleUserGuard)
    create(@Body() createTupleItemDto: CreateTupleItemDto) {
        return this.tupleItemsService.create(createTupleItemDto);
    }

    @Get(":id")
    @UseGuards(UserGuard, UserConnectionGuard, TupleItemUserGuard)
    findOne(@Param("id") id: string) {
        return this.tupleItemsService.findOne(+id);
    }

    @Patch(":id")
    @UseGuards(UserGuard, UserConnectionGuard, TupleItemUserGuard)
    update(@Param("id") id: string, @Body() updateTupleItemDto: UpdateTupleItemDto) {
        return this.tupleItemsService.update(+id, updateTupleItemDto);
    }

    @Patch()
    @UseGuards(UserGuard, UserConnectionGuard, TupleUserGuard)
    batchUpdate(@Body() updateTupleItemsDto: UpdateTupleItemsDto) {
        const { tupleId, tupleItems } = updateTupleItemsDto;
        return this.tupleItemsService.batchUpdate(tupleId, tupleItems);
    }

    @Delete(":id")
    @UseGuards(UserGuard, UserConnectionGuard, TupleItemUserGuard)
    delete(@Param("id") id: string) {
        return this.tupleItemsService.delete(+id);
    }
}
