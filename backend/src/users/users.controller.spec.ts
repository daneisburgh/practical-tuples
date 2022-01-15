import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { NewConnectionGuard } from "./guards/new-connection.guard";
import { UserGuard } from "./guards/user.guard";
import { ConnectionsService } from "../connections/connections.service";
import { Connection } from "../connections/entities/connection.entity";

describe("UsersController", () => {
    let controller: UsersController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository
                },
                {
                    provide: getRepositoryToken(Connection),
                    useClass: Repository
                },
                NewConnectionGuard,
                UserGuard,
                ConnectionsService
            ]
        }).compile();

        controller = module.get<UsersController>(UsersController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
