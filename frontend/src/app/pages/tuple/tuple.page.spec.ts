import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterModule } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { IonicStorageModule } from "@ionic/storage-angular";

import { TuplePage } from "./tuple.page";

describe("TuplePage", () => {
    let component: TuplePage;
    let fixture: ComponentFixture<TuplePage>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [TuplePage],
                imports: [
                    HttpClientModule,
                    IonicModule.forRoot(),
                    IonicStorageModule.forRoot(),
                    RouterModule.forRoot([])
                ]
            }).compileComponents();

            fixture = TestBed.createComponent(TuplePage);
            component = fixture.componentInstance;
            fixture.detectChanges();
        })
    );

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
