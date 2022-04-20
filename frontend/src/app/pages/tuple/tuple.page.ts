import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertController, Platform } from "@ionic/angular";
import { merge, orderBy, toInteger } from "lodash";
import { Subscription } from "rxjs";

import { ToastService } from "../../shared/services/utils/toast/toast.service";
import {
    Tuple,
    TuplesService,
    TupleType
} from "../../shared/services/resources/tuples/tuples.service";
import {
    TupleItem,
    TupleItemsService
} from "../../shared/services/resources/tuple-items/tuple-items.service";
import { UsersService } from "../../shared/services/resources/users/users.service";
import { AppComponent } from "src/app/app.component";

@Component({
    selector: "app-tuple",
    templateUrl: "./tuple.page.html",
    styleUrls: ["./tuple.page.scss"]
})
export class TuplePage implements OnInit, OnDestroy {
    @ViewChild("input") inputElement: ElementRef;

    isCreatingTupleItem = false;
    isDeletingTuple = false;
    isDeletingTupleItem = false;
    isUpdatingTupleName = false;
    isUpdatingTupleType = false;
    isUpdatingTupleItemChecked = false;
    isUpdatingTupleItemOrder = false;
    isUpdatingTupleItemName = false;
    showTupleNameInput = false;
    showTupleItemNameInputId = -1;
    tuple: Tuple;
    tupleName: string;
    tupleNameInput: string;
    tupleItemNameInput: string;
    updatingTupleItemId = -1;

    private usersServiceChangeEventSubscription: Subscription;

    constructor(
        private activatedRoute: ActivatedRoute,
        private alertController: AlertController,
        private platform: Platform,
        private router: Router,
        private toastService: ToastService,
        private tuplesService: TuplesService,
        private tupleItemsService: TupleItemsService,
        private usersService: UsersService
    ) {}

    get hideTupleEndButtons() {
        return this.platform.width() < 768 && this.showTupleNameInput;
    }

    get isAddingTupleItem() {
        return this.isCreatingTupleItem && this.updatingTupleItemId === -1;
    }

    get isInputDisabled() {
        return (
            this.isCreatingTupleItem ||
            this.isDeletingTuple ||
            this.isUpdatingTupleName ||
            this.isUpdatingTupleType ||
            this.isUpdatingTupleItemOrder ||
            this.isUpdatingTupleItemName ||
            this.updatingTupleItemId > -1 ||
            this.showTupleItemNameInputId > -1 ||
            this.showTupleNameInput
        );
    }

    get isConnected() {
        return AppComponent.connectionStatus === "Connected";
    }

    get isTupleTypeCheckbox() {
        return this.tuple.type === TupleType.checkbox;
    }

    get showTuplePopoverTrigger() {
        return !this.isDeletingTuple && !this.isUpdatingTupleName && !this.isUpdatingTupleType;
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
        this.usersServiceChangeEventSubscription.unsubscribe();
    }

    ngOnInit() {
        this.setTuple();
        this.usersServiceChangeEventSubscription = this.usersService.changeEvent.subscribe(() =>
            this.setTuple()
        );
    }

    async createTupleItem(afterTupleItem?: TupleItem) {
        this.isCreatingTupleItem = true;

        const { id, tupleItems } = this.tuple;
        let order = tupleItems.length;

        if (afterTupleItem) {
            const afterTupleItemId = afterTupleItem.id;
            this.updatingTupleItemId = afterTupleItemId;
            order = tupleItems.findIndex((tupleItem) => tupleItem.id === afterTupleItemId) + 1;
        }

        await this.tupleItemsService.create(id, order);

        this.isCreatingTupleItem = false;
        this.updatingTupleItemId = -1;
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
                            this.isDeletingTuple = true;
                            await this.tuplesService.delete(this.tuple.id);
                            this.isDeletingTuple = false;
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
        this.isDeletingTupleItem = true;
        this.updatingTupleItemId = id;
        await this.tupleItemsService.delete(this.tuple.id, id);
        this.isDeletingTupleItem = false;
        this.updatingTupleItemId = -1;
    }

    handleInputElementFocusOut() {
        setTimeout(() => {
            if (this.showTupleNameInput && !this.isUpdatingTupleName) {
                if (this.tuple.name === this.tupleNameInput) {
                    this.showTupleNameInput = false;
                } else {
                    this.updateTupleName();
                }
            } else if (this.showTupleItemNameInputId > -1 && !this.isUpdatingTupleItemName) {
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

    isUpdatingTupleItem(tupleItemId: number) {
        return this.updatingTupleItemId === tupleItemId;
    }

    isUpdatingTupleItemCheckbox(tupleItemId: number) {
        return this.isUpdatingTupleItem(tupleItemId) && this.isUpdatingTupleItemChecked;
    }

    async handleTupleItemReorder(event: any) {
        const previousTupleItems = JSON.parse(JSON.stringify(this.tuple.tupleItems));
        const reorderedTupleItems: TupleItem[] = event.detail.complete(this.tuple.tupleItems);

        this.isUpdatingTupleItemOrder = true;
        const reordered = await this.tuplesService.reorder(this.tuple.id, reorderedTupleItems);
        this.isUpdatingTupleItemOrder = false;

        if (!reordered) {
            this.tuple.tupleItems = previousTupleItems;
        }
    }

    showTupleItemPopoverTrigger(tupleItemId: number) {
        return !this.isUpdatingTupleItem(tupleItemId) || this.isUpdatingTupleItemChecked;
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

        if (!this.isUpdatingTupleItemChecked) {
            this.isUpdatingTupleItemChecked = true;
            this.updatingTupleItemId = id;
            const updated = await this.tupleItemsService.update(this.tuple.id, id, {
                isChecked: !isChecked
            });

            if (!updated) {
                this.tuple.tupleItems[tupleItemIndex].isChecked = isChecked;
            }
        }

        this.isUpdatingTupleItemChecked = false;
        this.updatingTupleItemId = -1;
    }

    async updateTupleItemName(tupleItemIndex?: number) {
        tupleItemIndex =
            tupleItemIndex ??
            this.tuple.tupleItems.findIndex(
                (tupleItem) => tupleItem.id === this.showTupleItemNameInputId
            );

        const { id, name } = this.tuple.tupleItems[tupleItemIndex];

        if (name !== this.tupleItemNameInput) {
            this.isUpdatingTupleItemName = true;
            this.updatingTupleItemId = id;
            const updated = await this.tupleItemsService.update(this.tuple.id, id, {
                name: this.tupleItemNameInput
            });

            if (updated) {
                this.tuple.tupleItems[tupleItemIndex].name = this.tupleItemNameInput;
                this.showTupleItemNameInputId = -1;
            }

            this.isUpdatingTupleItemName = false;
            this.updatingTupleItemId = -1;
        }
    }

    async updateTupleName() {
        const { id, name } = this.tuple;

        if (name !== this.tupleNameInput) {
            this.isUpdatingTupleName = true;
            const updated = await this.tuplesService.update(id, { name: this.tupleNameInput });

            if (updated) {
                this.tuple.name = this.tupleNameInput;
                this.showTupleNameInput = false;
            }

            this.isUpdatingTupleName = false;
        }
    }

    async updateTupleType() {
        this.isUpdatingTupleType = true;

        const { id, type } = this.tuple;
        const newType = type === TupleType.checkbox ? TupleType.list : TupleType.checkbox;
        const updated = await this.tuplesService.update(id, { type: newType });

        if (updated) {
            this.tuple.type = newType;
        }

        this.isUpdatingTupleType = false;
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
        }

        if (this.user) {
            const tuple = this.user.tuples.find((t) => t.id === tupleId);

            if (tuple) {
                tuple.tupleItems = orderBy(tuple.tupleItems, "order", "asc");
                this.tupleName = tuple.name;

                if (this.tuple) {
                    merge(this.tuple, tuple);
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
