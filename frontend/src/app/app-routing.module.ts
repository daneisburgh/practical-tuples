import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

import { AccountPage } from "./pages/account/account.page";
import { ErrorPage } from "./pages/error/error.page";
import { HomePage } from "./pages/home/home.page";
import { TuplePage } from "./pages/tuple/tuple.page";

const routes: Routes = [
    {
        path: "",
        component: HomePage,
        children: []
    },
    {
        path: "account",
        component: AccountPage
    },
    {
        path: "tuple/:id",
        component: TuplePage
    },
    {
        path: "**",
        component: ErrorPage
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
