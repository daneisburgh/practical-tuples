import { PartialType, PickType } from "@nestjs/mapped-types";

import { FriendRequest } from "../entities/friend-request.entity";

export class UpdateFriendRequestDto extends PartialType(PickType(FriendRequest, ["status"])) {}
