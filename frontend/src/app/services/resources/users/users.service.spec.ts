import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { IonicStorageModule } from "@ionic/storage-angular";

import { UsersService } from "./users.service";

describe("UsersService", () => {
    let service: UsersService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, IonicStorageModule.forRoot(), RouterTestingModule]
        });
        service = TestBed.inject(UsersService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
