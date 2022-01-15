import { Controller, Get, Post, Body, Patch, Param, Delete } from "@nestjs/common";
import { TupleItemsService } from "./tuple-items.service";
import { CreateTupleItemDto } from "./dto/create-tuple-item.dto";
import { UpdateTupleItemDto } from "./dto/update-tuple-item.dto";

@Controller("tuple-items")
export class TupleItemsController {
    constructor(private readonly tupleItemsService: TupleItemsService) {}

    @Post()
    create(@Body() createTupleItemDto: CreateTupleItemDto) {
        return this.tupleItemsService.create(createTupleItemDto);
    }

    @Get()
    findAll() {
        return this.tupleItemsService.findAll();
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.tupleItemsService.findOne(+id);
    }

    @Patch(":id")
    update(@Param("id") id: string, @Body() updateTupleItemDto: UpdateTupleItemDto) {
        return this.tupleItemsService.update(+id, updateTupleItemDto);
    }

    @Delete(":id")
    remove(@Param("id") id: string) {
        return this.tupleItemsService.remove(+id);
    }
}
