import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { toInteger } from "lodash";

import { Tuple } from "../../services/resources/tuples/tuples.service";
import { UsersService } from "../../services/resources/users/users.service";

@Component({
    selector: "app-tuple",
    templateUrl: "./tuple.page.html",
    styleUrls: ["./tuple.page.scss"]
})
export class TuplePage implements OnInit {
    tuple: Tuple;

    constructor(private activatedRoute: ActivatedRoute, private usersService: UsersService) {}

    ngOnInit() {
        const id = toInteger(this.activatedRoute.snapshot.paramMap.get("id"));
        this.tuple = this.usersService.user.tuples.find((tuple) => tuple.id === id);
    }
}
