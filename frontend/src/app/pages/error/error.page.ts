import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import builtinStatusCodes from "builtin-status-codes";

@Component({
    selector: "app-error",
    templateUrl: "./error.page.html",
    styleUrls: ["./error.page.scss"]
})
export class ErrorPage implements OnInit {
    message = "Not Found";

    constructor(private activatedRoute: ActivatedRoute, private title: Title) {}

    ngOnInit() {
        const code = this.activatedRoute.snapshot.queryParamMap.get("code");

        if (code && builtinStatusCodes[code]) {
            this.message = builtinStatusCodes[code];
        }

        this.title.setTitle("Practical Tuples | " + this.message);
    }
}
