import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { IonicStorageModule } from "@ionic/storage-angular";

import { TupleItemsService } from "./tuple-items.service";

describe("TupleItemsService", () => {
    let service: TupleItemsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, IonicStorageModule.forRoot(), RouterTestingModule]
        });
        service = TestBed.inject(TupleItemsService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
