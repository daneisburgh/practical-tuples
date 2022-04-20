import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { IonicModule } from "@ionic/angular";
import { IonicStorageModule } from "@ionic/storage-angular";

import { TuplePage } from "./tuple.page";

describe("TuplePage", () => {
    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [TuplePage],
                imports: [
                    HttpClientModule,
                    IonicModule.forRoot(),
                    IonicStorageModule.forRoot(),
                    RouterTestingModule
                ],
                schemas: [CUSTOM_ELEMENTS_SCHEMA]
            }).compileComponents();
        })
    );

    it("should create", () => {
        const fixture = TestBed.createComponent(TuplePage);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });
});
