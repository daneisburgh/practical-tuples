import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Req } from "@nestjs/common";

import { TuplesService } from "./tuples.service";
import { CreateTupleDto } from "./dto/create-tuple.dto";
import { UpdateTupleDto } from "./dto/update-tuple.dto";
import { TupleCreatorGuard } from "./guards/tuple-creator.guard";
import { TupleUserGuard } from "./guards/tuple-user.guard";
import { UserConnectionGuard } from "../users/guards/user-connection.guard";
import { UserGuard } from "../users/guards/user.guard";

@Controller("tuples")
export class TuplesController {
    constructor(private readonly tuplesService: TuplesService) {}

    @Post()
    @UseGuards(UserGuard, UserConnectionGuard)
    create(@Body() createTupleDto: CreateTupleDto, @Req() request) {
        return this.tuplesService.create(createTupleDto, request.user);
    }

    @Patch(":id")
    @UseGuards(UserGuard, UserConnectionGuard, TupleUserGuard)
    update(@Param("id") id: string, @Body() updateTupleDto: UpdateTupleDto, @Req() request) {
        return this.tuplesService.update(+id, updateTupleDto);
    }

    @Delete(":id")
    @UseGuards(UserGuard, UserConnectionGuard, TupleCreatorGuard)
    remove(@Param("id") id: string, @Req() request) {
        return this.tuplesService.remove(+id);
    }
}
