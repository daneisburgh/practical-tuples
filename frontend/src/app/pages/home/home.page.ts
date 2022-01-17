import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { TuplesService } from "src/app/services/resources/tuples/tuples.service";

import { UsersService } from "../../services/resources/users/users.service";

@Component({
    selector: "app-home",
    templateUrl: "home.page.html",
    styleUrls: ["home.page.scss"]
})
export class HomePage {
    creatingTuple = false;

    constructor(
        private router: Router,
        private tuplesService: TuplesService,
        private usersService: UsersService
    ) {}

    get user() {
        return this.usersService.user;
    }

    async createTuple() {
        this.creatingTuple = true;
        const { id } = await this.tuplesService.create();
        this.router.navigateByUrl("/tuple/" + id);
        this.creatingTuple = false;
    }
}
