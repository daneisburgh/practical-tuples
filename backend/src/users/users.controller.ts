import {
    Controller,
    Post,
    Headers,
    Patch,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
    Req,
    Body,
    Delete
} from "@nestjs/common";

import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ConnectionGuard } from "./guards/connection.guard";
import { UserConnectGuard } from "./guards/user-connect.guard";
import { UserGuard } from "./guards/user.guard";

@Controller("users")
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @UseGuards(ConnectionGuard)
    create(
        @Headers("connection-id") connectionId: string,
        @Headers("device-id") deviceId: string,
        @Body() createUserDto: CreateUserDto
    ) {
        return this.usersService.create(connectionId, deviceId, createUserDto);
    }

    @Delete()
    @UseGuards(UserGuard)
    delete(@Req() request) {
        return this.usersService.delete(request.user);
    }

    @Patch()
    @UseGuards(UserGuard)
    update(@Req() request, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(request.user.id, updateUserDto);
    }

    @Patch("connect")
    @UseGuards(ConnectionGuard, UserConnectGuard)
    connect(
        @Req() request,
        @Headers("connection-id") connectionId: string,
        @Headers("device-id") deviceId: string
    ) {
        return this.usersService.connect(request.user, connectionId, deviceId);
    }
}
