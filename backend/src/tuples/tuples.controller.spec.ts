import { Test, TestingModule } from "@nestjs/testing";
import { TuplesController } from "./tuples.controller";
import { TuplesService } from "./tuples.service";

describe("TuplesController", () => {
    let controller: TuplesController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TuplesController],
            providers: [TuplesService]
        }).compile();

        controller = module.get<TuplesController>(TuplesController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
