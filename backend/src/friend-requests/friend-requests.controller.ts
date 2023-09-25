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
import { FriendRequestsService } from "./friend-requests.service";
import { CreateFriendRequestDto } from "./dto/create-friend-request.dto";
import { UpdateFriendRequestDto } from "./dto/update-friend-request.dto";
import { FriendRequestUserGuard } from "./guards/friend-request-user.guard";
import { FriendRequesteeUserGuard } from "./guards/friend-requestee-user.guard";
import { UserGuard } from "../users/guards/user.guard";

@Controller("friend-requests")
export class FriendRequestsController {
    constructor(private readonly friendRequestsService: FriendRequestsService) {}

    @Post()
    @UseGuards(UserGuard)
    create(
        @Req() request,
        @Body() createFriendRequestDto: CreateFriendRequestDto,
        @Headers("connection-id") connectionId: string
    ) {
        return this.friendRequestsService.create(
            createFriendRequestDto,
            connectionId,
            request.user
        );
    }

    @Delete(":id")
    @UseGuards(UserGuard, FriendRequestUserGuard)
    delete(@Param("id") id: number, @Headers("connection-id") connectionId: string) {
        return this.friendRequestsService.delete(+id, connectionId);
    }

    @Patch(":id")
    @UseGuards(UserGuard, FriendRequesteeUserGuard)
    update(
        @Param("id") id: number,
        @Body() updateFriendRequestDto: UpdateFriendRequestDto,
        @Headers("connection-id") connectionId: string
    ) {
        return this.friendRequestsService.update(+id, updateFriendRequestDto, connectionId);
    }
}
