import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { toInteger } from "lodash";

import { Tuple, TuplesService } from "../../services/resources/tuples/tuples.service";
import { UsersService } from "../../services/resources/users/users.service";
import { TupleItemsService } from "../../services/resources/tuple-items/tuple-items.service";

@Component({
    selector: "app-tuple",
    templateUrl: "./tuple.page.html",
    styleUrls: ["./tuple.page.scss"]
})
export class TuplePage implements OnInit {
    creatingTupleItem = false;
    deletingTuple = false;
    deletingTupleItem = false;
    showTupleNameInput = false;
    updatingTupleName = false;
    tuple: Tuple;
    tupleNameInput: string;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private usersService: UsersService,
        private tuplesService: TuplesService,
        private tupleItemsService: TupleItemsService
    ) {}

    get user() {
        return this.usersService.user;
    }

    @HostListener("document:keypress", ["$event"])
    handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === "Enter") {
            if (this.showTupleNameInput) {
                this.updateTupleName();
            }
        }
    }

    ngOnInit() {
        const id = toInteger(this.activatedRoute.snapshot.paramMap.get("id"));
        this.setTuple(id);
    }

    async deleteTuple() {
        this.deletingTuple = true;
        await this.tuplesService.delete(this.tuple.id);
        this.router.navigateByUrl("/");
        this.deletingTuple = false;
    }

    toggleTupleNameInput() {
        this.tupleNameInput = this.tuple.name;
        this.showTupleNameInput = true;
    }

    async updateTupleName() {
        const { id, name } = this.tuple;

        if (name !== this.tupleNameInput && this.tupleNameInput.length <= 20) {
            this.updatingTupleName = true;
            await this.tuplesService.update(id, { name: this.tupleNameInput });
            this.setTuple(id);
            this.showTupleNameInput = false;
            this.updatingTupleName = false;
        }
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
            } else {
                this.router.navigateByUrl("/error", { skipLocationChange: true });
            }
        }
    }
}
