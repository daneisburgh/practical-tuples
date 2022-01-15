import { TestBed } from "@angular/core/testing";

import { TupleItemsService } from "./tuple-items.service";

describe("TupleItemsService", () => {
    let service: TupleItemsService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TupleItemsService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
