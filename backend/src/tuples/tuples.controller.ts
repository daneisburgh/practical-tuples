import { Controller, Post, Body, Patch, Param, Delete, UseGuards, Req } from "@nestjs/common";

import { TuplesService } from "./tuples.service";
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
    create(@Req() request) {
        return this.tuplesService.create(request.user);
    }

    @Patch(":id")
    @UseGuards(UserGuard, UserConnectionGuard, TupleUserGuard)
    update(@Param("id") id: string, @Body() updateTupleDto: UpdateTupleDto) {
        return this.tuplesService.update(+id, updateTupleDto);
    }

    @Delete(":id")
    @UseGuards(UserGuard, UserConnectionGuard, TupleCreatorGuard)
    delete(@Param("id") id: string) {
        return this.tuplesService.delete(+id);
    }
}
