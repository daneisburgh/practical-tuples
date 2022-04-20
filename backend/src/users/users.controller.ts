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
        @Body() createUserDto: CreateUserDto,
        @Headers("connection-id") connectionId: string,
        @Headers("device-id") deviceId: string
    ) {
        return this.usersService.create(createUserDto, connectionId, deviceId);
    }

    @Delete()
    @UseGuards(UserGuard)
    delete(@Req() request, @Headers("connection-id") connectionId: string) {
        return this.usersService.delete(request.user, connectionId);
    }

    @Patch()
    @UseGuards(UserGuard)
    update(
        @Req() request,
        @Body() updateUserDto: UpdateUserDto,
        @Headers("connection-id") connectionId: string
    ) {
        return this.usersService.update(request.user.id, updateUserDto, connectionId);
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
