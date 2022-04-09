import { HttpClientModule } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { IonicModule } from "@ionic/angular";
import { IonicStorageModule } from "@ionic/storage-angular";

import { AccountPage } from "./account.page";

describe("AccountPage", () => {
    let component: AccountPage;
    let fixture: ComponentFixture<AccountPage>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [AccountPage],
                imports: [
                    HttpClientModule,
                    IonicModule.forRoot(),
                    IonicStorageModule.forRoot(),
                    RouterTestingModule
                ]
            }).compileComponents();

            fixture = TestBed.createComponent(AccountPage);
            component = fixture.componentInstance;
            fixture.detectChanges();
        })
    );

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
