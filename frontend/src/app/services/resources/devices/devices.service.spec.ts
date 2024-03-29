import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { IonicStorageModule } from "@ionic/storage-angular";

import { DevicesService } from "./devices.service";

describe("DevicesService", () => {
    let service: DevicesService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, IonicStorageModule.forRoot(), RouterTestingModule]
        });
        service = TestBed.inject(DevicesService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
