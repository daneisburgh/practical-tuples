import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { IonicModule } from "@ionic/angular";
import { IonicStorageModule } from "@ionic/storage-angular";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { ErrorPage } from "./pages/error/error.page";
import { HomePage } from "./pages/home/home.page";
import { TuplePage } from "./pages/tuple/tuple.page";
import { AccountPage } from "./pages/account/account.page";

@NgModule({
    declarations: [AppComponent, ErrorPage, HomePage, AccountPage, TuplePage],
    entryComponents: [],
    imports: [
        CommonModule,
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule.forRoot({ mode: "md" }),
        IonicStorageModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
