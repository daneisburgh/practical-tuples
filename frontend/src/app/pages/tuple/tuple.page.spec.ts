import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { IonicModule } from "@ionic/angular";

import { TuplePage } from "./tuple.page";

describe("TuplePage", () => {
    let component: TuplePage;
    let fixture: ComponentFixture<TuplePage>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [TuplePage],
                imports: [IonicModule.forRoot()]
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
