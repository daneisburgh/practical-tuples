import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TuplesService } from "./tuples.service";
import { Tuple } from "./entities/tuple.entity";
import { ConnectionsService } from "../connections/connections.service";
import { Connection } from "../connections/entities/connection.entity";
import { Device } from "../devices/entities/device.entity";
import { TupleItem } from "../tuple-items/entities/tuple-item.entity";

describe("TuplesService", () => {
    let service: TuplesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TuplesService,
                ConnectionsService,
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
                }
            ]
        }).compile();

        service = module.get<TuplesService>(TuplesService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
