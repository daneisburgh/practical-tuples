import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { DevicesController } from "./devices.controller";
import { DevicesService } from "./devices.service";
import { Device } from "./entities/device.entity";
import { ConnectionsService } from "../connections/connections.service";
import { Connection } from "../connections/entities/connection.entity";
import { Tuple } from "../tuples/entities/tuple.entity";
import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entity";
import { ConnectionGuard } from "../users/guards/connection.guard";
import { UserGuard } from "../users/guards/user.guard";

describe("DevicesController", () => {
    let controller: DevicesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [DevicesController],
            providers: [
                DevicesService,
                ConnectionsService,
                UsersService,
                ConnectionGuard,
                UserGuard,
                {
                    provide: getRepositoryToken(Device),
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
                }
            ]
        }).compile();

        controller = module.get<DevicesController>(DevicesController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
