import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TupleItem } from "./entities/tuple-item.entity";
import { TupleItemsController } from "./tuple-items.controller";
import { TupleItemsService } from "./tuple-items.service";
import { ConnectionsService } from "../connections/connections.service";
import { Connection } from "../connections/entities/connection.entity";
import { Device } from "../devices/entities/device.entity";
import { TuplesService } from "../tuples/tuples.service";
import { Tuple } from "../tuples/entities/tuple.entity";
import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entity";
import { UserGuard } from "../users/guards/user.guard";

describe("TupleItemsController", () => {
    let controller: TupleItemsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TupleItemsController],
            providers: [
                ConnectionsService,
                TupleItemsService,
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
                    provide: getRepositoryToken(TupleItem),
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

        controller = module.get<TupleItemsController>(TupleItemsController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
