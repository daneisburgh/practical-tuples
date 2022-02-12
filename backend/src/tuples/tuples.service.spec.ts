import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TuplesService } from "./tuples.service";
import { Tuple } from "./entities/tuple.entity";
import { ConnectionsService } from "../connections/connections.service";
import { Connection } from "../connections/entities/connection.entity";
import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entity";

describe("TuplesService", () => {
    let service: TuplesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TuplesService,
                ConnectionsService,
                UsersService,
                {
                    provide: getRepositoryToken(Tuple),
                    useClass: Repository
                },
                {
                    provide: getRepositoryToken(Connection),
                    useClass: Repository
                },
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository
                }
            ]
        }).compile();

        service = module.get<TuplesService>(TuplesService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
