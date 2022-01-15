import { Test, TestingModule } from "@nestjs/testing";
import { TuplesService } from "./tuples.service";

describe("TuplesService", () => {
    let service: TuplesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [TuplesService]
        }).compile();

        service = module.get<TuplesService>(TuplesService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
