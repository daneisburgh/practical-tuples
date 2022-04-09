import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import builtinStatusCodes from "builtin-status-codes";
import { upperFirst } from "lodash";

@Component({
    selector: "app-error",
    templateUrl: "./error.page.html",
    styleUrls: ["./error.page.scss"]
})
export class ErrorPage implements OnInit {
    message = "Page not found";

    constructor(private activatedRoute: ActivatedRoute, private title: Title) {}

    ngOnInit() {
        const code = +this.activatedRoute.snapshot.queryParamMap.get("code");

        if (code && code !== 404 && builtinStatusCodes[code]) {
            this.message = upperFirst(builtinStatusCodes[code].toLowerCase());
        }

        this.title.setTitle("Practical Tuples | " + this.message);
    }
}
