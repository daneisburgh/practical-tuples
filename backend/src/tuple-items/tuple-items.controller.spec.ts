import { Test, TestingModule } from "@nestjs/testing";
import { TupleItemsController } from "./tuple-items.controller";
import { TupleItemsService } from "./tuple-items.service";

describe("TupleItemsController", () => {
    let controller: TupleItemsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TupleItemsController],
            providers: [TupleItemsService]
        }).compile();

        controller = module.get<TupleItemsController>(TupleItemsController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
