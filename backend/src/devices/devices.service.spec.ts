import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Connection, Repository } from "typeorm";

import { DevicesService } from "./devices.service";
import { Device } from "./entities/device.entity";
import { ConnectionsService } from "../connections/connections.service";
import { TupleItemsService } from "../tuple-items/tuple-items.service";
import { TupleItem } from "../tuple-items/entities/tuple-item.entity";
import { TuplesService } from "../tuples/tuples.service";
import { Tuple } from "../tuples/entities/tuple.entity";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";

describe("DevicesService", () => {
    let service: DevicesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConnectionsService,
                DevicesService,
                TupleItemsService,
                TuplesService,
                UsersService,
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
                    provide: getRepositoryToken(TupleItem),
                    useClass: Repository
                },
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository
                }
            ]
        }).compile();

        service = module.get<DevicesService>(DevicesService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
