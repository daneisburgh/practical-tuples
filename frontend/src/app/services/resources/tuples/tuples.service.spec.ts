import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { IonicStorageModule } from "@ionic/storage-angular";

import { TuplesService } from "./tuples.service";

describe("TuplesService", () => {
    let service: TuplesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, IonicStorageModule.forRoot()]
        });
        service = TestBed.inject(TuplesService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
