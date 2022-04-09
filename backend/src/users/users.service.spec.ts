import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UsersService } from "./users.service";
import { User } from "./entities/user.entity";
import { Device } from "../devices/entities/device.entity";
import { Tuple } from "../tuples/entities/tuple.entity";
import { ConnectionsService } from "../connections/connections.service";

describe("UsersService", () => {
    let service: UsersService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                ConnectionsService,
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

        service = module.get<UsersService>(UsersService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
