import { Test, TestingModule } from "@nestjs/testing";
import { TupleItemsService } from "./tuple-items.service";

describe("TupleItemsService", () => {
    let service: TupleItemsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TupleItemsService]
        }).compile();

        service = module.get<TupleItemsService>(TupleItemsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
