import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { IonicStorageModule } from "@ionic/storage-angular";

import { HttpService } from "./http.service";

describe("HttpService", () => {
    let service: HttpService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [HttpService],
            imports: [HttpClientModule, IonicStorageModule.forRoot(), RouterTestingModule]
        });
        service = TestBed.inject(HttpService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
