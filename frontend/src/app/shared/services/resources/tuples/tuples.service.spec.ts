import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { IonicStorageModule } from "@ionic/storage-angular";

import { TuplesService } from "./tuples.service";

describe("TuplesService", () => {
    let service: TuplesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, IonicStorageModule.forRoot(), RouterTestingModule]
        });
        service = TestBed.inject(TuplesService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
