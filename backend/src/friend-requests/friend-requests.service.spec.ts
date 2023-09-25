import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { FriendRequest } from "./entities/friend-request.entity";
import { FriendRequestsService } from "./friend-requests.service";
import { ConnectionsService } from "../connections/connections.service";
import { Connection } from "../connections/entities/connection.entity";
import { Device } from "../devices/entities/device.entity";
import { Tuple } from "../tuples/entities/tuple.entity";
import { User } from "../users/entities/user.entity";
import { ConnectionGuard } from "../users/guards/connection.guard";
import { UserGuard } from "../users/guards/user.guard";
import { UsersService } from "../users/users.service";

describe("FriendsService", () => {
    let service: FriendRequestsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FriendRequestsService,
                ConnectionsService,
                UsersService,
                ConnectionGuard,
                UserGuard,
                {
                    provide: getRepositoryToken(FriendRequest),
                    useClass: Repository
                },
                {
                    provide: getRepositoryToken(Connection),
                    useClass: Repository
                },
                {
                    provide: getRepositoryToken(Tuple),
                    useClass: Repository
                },
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository
                },
                {
                    provide: getRepositoryToken(Device),
                    useClass: Repository
                }
            ]
        }).compile();

        service = module.get<FriendRequestsService>(FriendRequestsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
