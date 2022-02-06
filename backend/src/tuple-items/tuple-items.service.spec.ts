import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { TupleItem } from "./entities/tuple-item.entity";
import { TupleItemsService } from "./tuple-items.service";

describe("TupleItemsService", () => {
    let service: TupleItemsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TupleItemsService,
                {
                    provide: getRepositoryToken(TupleItem),
                    useClass: Repository
                }
            ]
        }).compile();

        service = module.get<TupleItemsService>(TupleItemsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
