import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { toInteger } from "lodash";

import { Tuple } from "../../services/resources/tuples/tuples.service";
import { UsersService } from "../../services/resources/users/users.service";
import { TupleItemsService } from "../../services/resources/tuple-items/tuple-items.service";

@Component({
    selector: "app-tuple",
    templateUrl: "./tuple.page.html",
    styleUrls: ["./tuple.page.scss"]
})
export class TuplePage implements OnInit {
    creatingTupleItem = false;
    tuple: Tuple;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private usersService: UsersService,
        private tupleItemsService: TupleItemsService
    ) {}

    get user() {
        return this.usersService.user;
    }

    ngOnInit() {
        const id = toInteger(this.activatedRoute.snapshot.paramMap.get("id"));
        this.setTuple(id);
    }

    async createTupleItem() {
        this.creatingTupleItem = true;
        const { id } = await this.tupleItemsService.create();
        this.setTuple(id);
        this.creatingTupleItem = false;
    }

    private setTuple(id: number) {
        if (this.user) {
            const tuple = this.user.tuples.find((t) => t.id === id);

            if (tuple) {
                this.tuple = tuple;
                console.log(tuple);
            } else {
                this.router.navigateByUrl("/error", { skipLocationChange: true });
            }
        }
    }
}
