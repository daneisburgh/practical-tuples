import {
    Controller,
    Post,
    Headers,
    Patch,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
    Req
} from "@nestjs/common";

import { UsersService } from "./users.service";
import { NewConnectionGuard } from "./guards/new-connection.guard";
import { UserGuard } from "./guards/user.guard";

@Controller("users")
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Patch()
    @UseGuards(NewConnectionGuard, UserGuard)
    connect(@Headers() headers, @Req() request) {
        return this.usersService.connect(request.user.id, headers["connection-id"]);
    }

    @Post()
    @UseGuards(NewConnectionGuard)
    create(@Headers() headers) {
        return this.usersService.create(headers["connection-id"]);
    }
}
