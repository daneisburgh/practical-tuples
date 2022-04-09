import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TuplesController } from "./tuples.controller";
import { TuplesService } from "./tuples.service";
import { Tuple } from "./entities/tuple.entity";
import { ConnectionsService } from "../connections/connections.service";
import { Connection } from "../connections/entities/connection.entity";
import { Device } from "../devices/entities/device.entity";
import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entity";
import { UserGuard } from "../users/guards/user.guard";

describe("TuplesController", () => {
    let controller: TuplesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TuplesController],
            providers: [
                ConnectionsService,
                TuplesService,
                UsersService,
                UserGuard,
                {
                    provide: getRepositoryToken(Connection),
                    useClass: Repository
                },
                {
                    provide: getRepositoryToken(Device),
                    useClass: Repository
                },
                {
                    provide: getRepositoryToken(Tuple),
                    useClass: Repository
                },
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository
                }
            ]
        }).compile();

        controller = module.get<TuplesController>(TuplesController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
