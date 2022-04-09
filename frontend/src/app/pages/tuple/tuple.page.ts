import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    OnInit,
    ViewChild
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertController, Platform } from "@ionic/angular";
import { remove, toInteger } from "lodash";

import { AppComponent } from "../../app.component";
import { ToastService } from "../../services/utils/toast/toast.service";
import { Tuple, TuplesService, TupleType } from "../../services/resources/tuples/tuples.service";
import {
    TupleItem,
    TupleItemsService
} from "../../services/resources/tuple-items/tuple-items.service";
import { UsersService } from "../../services/resources/users/users.service";

@Component({
    selector: "app-tuple",
    templateUrl: "./tuple.page.html",
    styleUrls: ["./tuple.page.scss"]
})
export class TuplePage implements OnInit, AfterViewInit {
    @ViewChild("input") inputElement: ElementRef;

    isCreatingTupleItem = false;
    isDeletingTuple = false;
    isDeletingTupleItem = false;
    isUpdatingTupleName = false;
    isUpdatingTupleType = false;
    isUpdatingTupleItemChecked = false;
    isUpdatingTupleItemOrder = false;
    isUpdatingTupleItemValue = false;
    showTupleNameInput = false;
    showTupleItemValueInputId = -1;
    tuple: Tuple;
    tupleNameInput: string;
    tupleItemValueInput: string;
    updatingTupleItemId = -1;

    private tupleId: number;

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
        const isInputDisabled =
            this.isCreatingTupleItem ||
            this.isDeletingTuple ||
            this.isUpdatingTupleName ||
            this.isUpdatingTupleType ||
            this.isUpdatingTupleItemOrder ||
            this.isUpdatingTupleItemValue ||
            this.updatingTupleItemId > -1;

        AppComponent.showProgressBar = isInputDisabled;
        return isInputDisabled || this.showTupleItemValueInputId > -1 || this.showTupleNameInput;
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
                this.showTupleItemValueInputId = -1;
                break;
        }
    }

    ngOnInit() {
        this.tupleId = toInteger(this.activatedRoute.snapshot.paramMap.get("id"));
    }

    ngAfterViewInit() {
        if (!this.tuple && this.tupleId && this.user) {
            const tuple = this.user.tuples.find((t) => t.id === this.tupleId);

            if (tuple) {
                this.tuple = tuple;
            } else {
                this.router.navigateByUrl("/error", { skipLocationChange: true });
            }
        }
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

        try {
            await this.tupleItemsService.create(id, order);
        } catch (error) {
            console.error(error);
            this.toastService.present("danger", "Unable to create tuple item");
        }

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

                            try {
                                await this.tuplesService.delete(this.tuple.id);
                                this.router.navigateByUrl("/");
                            } catch (error) {
                                console.error(error);
                                this.toastService.present("danger", "Unable to delete tuple");
                            }

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

    async deleteTupleItem(tupleItem: TupleItem) {
        this.isDeletingTupleItem = true;
        this.updatingTupleItemId = tupleItem.id;

        try {
            await this.tupleItemsService.delete(tupleItem.id);
            remove(this.tuple.tupleItems, (ti) => ti.id === tupleItem.id);
        } catch (error) {
            console.error(error);
            this.toastService.present("danger", "Unable to delete tuple item");
        }

        this.isDeletingTupleItem = false;
        this.updatingTupleItemId = -1;
    }

    handleInputElementFocusOut() {
        setTimeout(() => {
            if (this.showTupleNameInput && !this.isUpdatingTupleName) {
                this.updateTupleName();
            } else if (this.showTupleItemValueInputId > -1 && !this.isUpdatingTupleItemValue) {
                this.updateTupleItemValue();
            }
        }, 100);
    }

    isUpdatingTupleItem(tupleItem: TupleItem) {
        return this.updatingTupleItemId === tupleItem.id;
    }

    isUpdatingTupleItemCheckbox(tupleItem: TupleItem) {
        return this.isUpdatingTupleItem(tupleItem) && this.isUpdatingTupleItemChecked;
    }

    async reorder(event: any) {
        this.isUpdatingTupleItemOrder = true;
        const tupleItems = event.detail.complete(this.tuple.tupleItems);

        for (let i = 0; i < tupleItems.length; i++) {
            tupleItems[i] = { id: tupleItems[i].id, order: i };
        }

        try {
            await this.tupleItemsService.reorder(this.tuple.id, tupleItems);
        } catch (error) {
            console.error(error);
            this.toastService.present("danger", "Unable to reorder tuple item");
        }

        this.isUpdatingTupleItemOrder = false;
    }

    showTupleItemPopoverTrigger(tupleItem: TupleItem) {
        return !this.isUpdatingTupleItem(tupleItem) || this.isUpdatingTupleItemChecked;
    }

    showTupleItemValueInput(tupleItem: TupleItem) {
        return this.showTupleItemValueInputId === tupleItem.id;
    }

    toggleTupleNameInput() {
        this.tupleNameInput = this.tuple.name;
        this.showTupleNameInput = true;
        this.inputElementFocus();
    }

    toggleTupleItemValueInput(tupleItem: TupleItem) {
        const { id, value } = tupleItem;
        this.tupleItemValueInput = value;
        this.showTupleItemValueInputId = id;
        this.inputElementFocus();
    }

    async updateTupleItemChecked(tupleItem: TupleItem) {
        const { id, isChecked } = tupleItem;
        this.isUpdatingTupleItemChecked = true;
        this.updatingTupleItemId = id;

        try {
            await this.tupleItemsService.update(id, { isChecked: !isChecked });
        } catch (error) {
            console.error(error);
            this.toastService.present(
                "danger",
                `Unable to ${isChecked ? "uncheck" : "check"} tuple item`
            );
        }

        this.isUpdatingTupleItemChecked = false;
        this.updatingTupleItemId = -1;
    }

    async updateTupleItemValue() {
        const index = this.tuple.tupleItems.findIndex(
            (tupleItem) => tupleItem.id === this.showTupleItemValueInputId
        );

        const { id, value } = this.tuple.tupleItems[index];

        if (value !== this.tupleItemValueInput) {
            this.isUpdatingTupleItemValue = true;
            this.updatingTupleItemId = id;

            try {
                await this.tupleItemsService.update(id, { value: this.tupleItemValueInput });
                this.tuple.tupleItems[index].value = this.tupleItemValueInput;
                this.showTupleItemValueInputId = -1;
                this.updatingTupleItemId = -1;
            } catch (error) {
                console.error(error);
                this.toastService.present("danger", "Unable to update tuple item value");
            }

            this.isUpdatingTupleItemValue = false;
            this.updatingTupleItemId = -1;
        }
    }

    async updateTupleName() {
        const { id, name } = this.tuple;

        if (name !== this.tupleNameInput) {
            try {
                this.isUpdatingTupleName = true;
                await this.tuplesService.update(id, { name: this.tupleNameInput });
                this.tuple.name = this.tupleNameInput;
                this.showTupleNameInput = false;
            } catch (error) {
                console.error(error);
                this.toastService.present("danger", "Unable to rename tuple");
            }

            this.isUpdatingTupleName = false;
        }
    }

    async updateTupleType() {
        this.isUpdatingTupleType = true;
        const { id, type } = this.tuple;

        try {
            const newType = type === TupleType.checkbox ? TupleType.list : TupleType.checkbox;
            await this.tuplesService.update(id, { type: newType });
            this.tuple.type = newType;
        } catch (error) {
            console.error(error);
            this.toastService.present("danger", "Unable to toggle checkboxes");
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
}
