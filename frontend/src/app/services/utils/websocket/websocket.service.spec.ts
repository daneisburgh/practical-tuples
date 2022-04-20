import { HttpClientModule } from "@angular/common/http";
import { TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { WebSocketService } from "./websocket.service";

describe("WebSocketService", () => {
    let service: WebSocketService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [WebSocketService],
            imports: [HttpClientModule, RouterTestingModule]
        });
        service = TestBed.inject(WebSocketService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
