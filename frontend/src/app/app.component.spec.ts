import { HttpClientModule } from "@angular/common/http";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { IonicStorageModule } from "@ionic/storage-angular";

import { AppComponent } from "./app.component";

describe("AppComponent", () => {
    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [HttpClientModule, IonicStorageModule.forRoot(), RouterTestingModule],
                declarations: [AppComponent],
                schemas: [CUSTOM_ELEMENTS_SCHEMA]
            }).compileComponents();
        })
    );

    it("should create the app", () => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    });
    // TODO: add more tests!
});
