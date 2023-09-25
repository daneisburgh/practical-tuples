import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { merge, orderBy, toInteger } from "lodash";
import { Subscription } from "rxjs";

import { ToastService } from "../../services/utils/toast/toast.service";
import { Tuple, TuplesService, TupleType } from "../../services/resources/tuples/tuples.service";
import {
    TupleItem,
    TupleItemsService
} from "../../services/resources/tuple-items/tuple-items.service";
import { UsersService } from "../../services/resources/users/users.service";
import { AppComponent } from "src/app/app.component";

@Component({
    selector: "app-tuple",
    templateUrl: "./tuple.page.html",
    styleUrls: ["./tuple.page.scss"]
})
export class TuplePage implements OnInit, OnDestroy {
    @ViewChild("input") inputElement: ElementRef;

    canUpdateTupleItemChecked = true;
    showTupleNameInput = false;
    showTupleItemNameInputId = -1;
    tuple: Tuple;
    tupleName: string;
    tupleNameInput: string;
    tupleItemNameInput: string;

    private usersServiceChangeEventSubscription: Subscription;

    constructor(
        private activatedRoute: ActivatedRoute,
        private alertController: AlertController,
        private router: Router,
        private toastService: ToastService,
        private tuplesService: TuplesService,
        private tupleItemsService: TupleItemsService,
        private usersService: UsersService
    ) {}

    get isConnected() {
        return AppComponent.connectionStatus === "Connected";
    }

    get isTupleTypeCheckbox() {
        return this.tuple.type === TupleType.checkbox;
    }

    get showProgressBar() {
        return AppComponent.showProgressBar;
    }

    get user() {
        return this.usersService.user;
    }

    @HostListener("document:keydown", ["$event"])
    keyboardEvent(event: KeyboardEvent) {
        const { key } = event;

        switch (key) {
            case "Enter":
                this.handleInputElementFocusOut();
                break;
            case "Escape":
                this.showTupleNameInput = false;
                this.showTupleItemNameInputId = -1;
                break;
        }
    }

    @HostListener("unloaded")
    ngOnDestroy() {
        if (this.usersServiceChangeEventSubscription) {
            this.usersServiceChangeEventSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.setTuple();
        this.usersServiceChangeEventSubscription = this.usersService.changeEvent.subscribe(() =>
            this.setTuple()
        );
    }

    async createTupleItem(afterTupleItem?: TupleItem) {
        const { id, tupleItems } = this.tuple;
        let order = tupleItems.length;

        if (afterTupleItem) {
            const afterTupleItemId = afterTupleItem.id;
            order = tupleItems.findIndex((tupleItem) => tupleItem.id === afterTupleItemId) + 1;
        }

        await this.tupleItemsService.create(id, order);
    }

    async deleteTuple() {
        (
            await this.alertController.create({
                message: "Please confirm tuple deletion. This action is irreversible.",
                buttons: [
                    {
                        text: "Delete",
                        cssClass: "alert-button-danger",
                        handler: async () => {
                            await this.tuplesService.delete(this.tuple.id);
                        }
                    },
                    {
                        text: "Cancel",
                        role: "cancel",
                        cssClass: "alert-button-cancel"
                    }
                ]
            })
        ).present();
    }

    async deleteTupleItem(id: number) {
        await this.tupleItemsService.delete(this.tuple.id, id);
    }

    handleInputElementFocusOut() {
        setTimeout(() => {
            if (this.showTupleNameInput) {
                if (this.tuple.name === this.tupleNameInput) {
                    this.showTupleNameInput = false;
                } else {
                    this.updateTupleName();
                }
            } else if (this.showTupleItemNameInputId > -1) {
                const tupleItemIndex = this.tuple.tupleItems.findIndex(
                    (tupleItem) => tupleItem.id === this.showTupleItemNameInputId
                );

                if (this.tuple.tupleItems[tupleItemIndex].name === this.tupleItemNameInput) {
                    this.showTupleItemNameInputId = -1;
                } else {
                    this.updateTupleItemName();
                }
            }
        }, 100);
    }

    async handleTupleItemReorder(event: any) {
        const previousTupleItems = JSON.parse(JSON.stringify(this.tuple.tupleItems));
        const reorderedTupleItems: TupleItem[] = event.detail.complete(this.tuple.tupleItems);
        const reordered = await this.tuplesService.reorder(this.tuple.id, reorderedTupleItems);

        if (!reordered) {
            this.tuple.tupleItems = previousTupleItems;
        }
    }

    showTupleItemNameInput(tupleItem: TupleItem) {
        return this.showTupleItemNameInputId === tupleItem.id;
    }

    toggleTupleNameInput() {
        this.tupleNameInput = this.tuple.name;
        this.showTupleNameInput = true;
        this.inputElementFocus();
    }

    toggleTupleItemNameInput(tupleItemIndex: number) {
        const { id, name } = this.tuple.tupleItems[tupleItemIndex];
        this.tupleItemNameInput = name;
        this.showTupleItemNameInputId = id;
        this.inputElementFocus();
    }

    async updateTupleItemChecked(tupleItemIndex: number) {
        const { id, isChecked } = this.tuple.tupleItems[tupleItemIndex];

        if (this.canUpdateTupleItemChecked) {
            const updated = await this.tupleItemsService.update(this.tuple.id, id, {
                isChecked: !isChecked
            });

            if (!updated) {
                this.tuple.tupleItems[tupleItemIndex].isChecked = isChecked;
            }
        }
    }

    async updateTupleItemName(tupleItemIndex?: number) {
        tupleItemIndex =
            tupleItemIndex ??
            this.tuple.tupleItems.findIndex(
                (tupleItem) => tupleItem.id === this.showTupleItemNameInputId
            );

        const { id, name } = this.tuple.tupleItems[tupleItemIndex];

        if (name !== this.tupleItemNameInput) {
            const updated = await this.tupleItemsService.update(this.tuple.id, id, {
                name: this.tupleItemNameInput
            });

            if (updated) {
                this.tuple.tupleItems[tupleItemIndex].name = this.tupleItemNameInput;
                this.showTupleItemNameInputId = -1;
            }
        }
    }

    async updateTupleName() {
        const { id, name } = this.tuple;

        if (name !== this.tupleNameInput) {
            const updated = await this.tuplesService.update(id, { name: this.tupleNameInput });

            if (updated) {
                this.tuple.name = this.tupleNameInput;
                this.showTupleNameInput = false;
            }
        }
    }

    async updateTupleType() {
        const { id, type } = this.tuple;
        const newType = type === TupleType.checkbox ? TupleType.list : TupleType.checkbox;
        const updated = await this.tuplesService.update(id, { type: newType });

        if (updated) {
            this.tuple.type = newType;
        }
    }

    private inputElementFocus() {
        setTimeout(() => {
            if (this.inputElement) {
                this.inputElement.nativeElement.focus();
            }
        }, 250);
    }

    private async setTuple() {
        const tupleId = toInteger(this.activatedRoute.snapshot.paramMap.get("id"));

        if (!this.user) {
            await this.usersService.setUser();
            this.tupleName = undefined;
        }

        if (this.user) {
            const tuple = this.user.tuples.find((t) => t.id === tupleId);

            if (tuple) {
                tuple.tupleItems = orderBy(tuple.tupleItems, "order", "asc");
                this.tupleName = tuple.name;

                if (this.tuple) {
                    this.canUpdateTupleItemChecked = false;
                    merge(this.tuple, tuple);
                    setTimeout(() => (this.canUpdateTupleItemChecked = true), 250);
                } else {
                    this.tuple = tuple;
                }
            } else {
                this.tuple = undefined;
            }
        }

        if (!this.tuple) {
            if (this.tupleName) {
                await this.toastService.present(
                    "danger",
                    `Tuple '${this.tupleName}' was deleted by another device`
                );
                this.router.navigateByUrl("/");
                this.tupleName = undefined;
            } else {
                this.router.navigateByUrl("/error", { skipLocationChange: true });
            }
        }
    }
}
