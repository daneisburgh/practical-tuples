import { TestBed } from "@angular/core/testing";

import { TuplesService } from "./tuples.service";

describe("TuplesService", () => {
    let service: TuplesService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TuplesService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
