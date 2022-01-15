import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TuplesController } from "./tuples.controller";
import { TuplesService } from "./tuples.service";
import { Tuple } from "./entities/tuple.entity";
import { UsersService } from "../users/users.service";
import { User } from "../users/entities/user.entity";
import { UserGuard } from "../users/guards/user.guard";
import { UserConnectionGuard } from "../users/guards/user-connection.guard";

describe("TuplesController", () => {
    let controller: TuplesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TuplesController],
            providers: [
                TuplesService,
                UsersService,
                UserGuard,
                UserConnectionGuard,
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
