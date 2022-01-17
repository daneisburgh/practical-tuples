import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";

import { IonicModule } from "@ionic/angular";
import { IonicStorageModule } from "@ionic/storage-angular";

import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ErrorPage } from "./pages/error/error.page";
import { HomePage } from "./pages/home/home.page";
import { SettingsPage } from "./pages/settings/settings.page";
import { TuplePage } from "./pages/tuple/tuple.page";

@NgModule({
    declarations: [AppComponent, ErrorPage, HomePage, SettingsPage, TuplePage],
    entryComponents: [],
    imports: [
        CommonModule,
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule.forRoot({ animated: false, mode: "md" }),
        IonicStorageModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
