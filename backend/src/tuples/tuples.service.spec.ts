import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TuplesService } from "./tuples.service";
import { Tuple } from "./entities/tuple.entity";

describe("TuplesService", () => {
    let service: TuplesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TuplesService,
                {
                    provide: getRepositoryToken(Tuple),
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
