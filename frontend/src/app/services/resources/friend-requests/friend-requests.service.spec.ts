import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { IonicStorageModule } from "@ionic/storage-angular";

import { FriendRequestsService } from "./friend-requests.service";

describe("FriendRequestsService", () => {
    let service: FriendRequestsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule, IonicStorageModule.forRoot(), RouterTestingModule]
        });
        service = TestBed.inject(FriendRequestsService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
