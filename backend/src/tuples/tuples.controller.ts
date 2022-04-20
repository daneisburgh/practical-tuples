import {
    Controller,
    Headers,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Req
} from "@nestjs/common";

import { TuplesService } from "./tuples.service";
import { UpdateTupleDto } from "./dto/update-tuple.dto";
import { TupleUserGuard } from "./guards/tuple-user.guard";
import { UserGuard } from "../users/guards/user.guard";

@Controller("tuples")
export class TuplesController {
    constructor(private readonly tuplesService: TuplesService) {}

    @Post()
    @UseGuards(UserGuard)
    create(@Req() request, @Headers("connection-id") connectionId: string) {
        return this.tuplesService.create(request.user, connectionId);
    }

    @Delete(":id")
    @UseGuards(UserGuard, TupleUserGuard)
    delete(@Param("id") id: string, @Headers("connection-id") connectionId: string) {
        return this.tuplesService.delete(+id, connectionId);
    }

    @Patch(":id")
    @UseGuards(UserGuard, TupleUserGuard)
    update(
        @Param("id") id: string,
        @Body() updateTupleDto: UpdateTupleDto,
        @Headers("connection-id") connectionId: string
    ) {
        return this.tuplesService.update(+id, updateTupleDto, connectionId);
    }
}
