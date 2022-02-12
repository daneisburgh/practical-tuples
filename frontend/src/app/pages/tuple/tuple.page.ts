import { Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertController, Platform } from "@ionic/angular";
import { toInteger } from "lodash";

import { TuplesService, TupleType } from "../../services/resources/tuples/tuples.service";
import { UsersService } from "../../services/resources/users/users.service";
import {
    TupleItem,
    TupleItemsService
} from "../../services/resources/tuple-items/tuple-items.service";

@Component({
    selector: "app-tuple",
    templateUrl: "./tuple.page.html",
    styleUrls: ["./tuple.page.scss"]
})
export class TuplePage implements OnInit {
    @ViewChild("input") inputElement: ElementRef;

    readonly displayInputMinPlatformWidth = 480;

    creatingTupleItemAfterTupleItemId = -1;
    deletingTupleItemId = -1;
    isCreatingTupleItem = false;
    isDeletingTuple = false;
    isDeletingTupleItem = false;
    isUpdatingTupleName = false;
    isUpdatingTupleType = false;
    isUpdatingTupleItemValue = false;
    platformWidth = 0;
    showTupleNameInput = false;
    showTupleItemValueInputId = -1;
    tupleNameInput: string;
    tupleItemValueInput: string;

    private tupleId: number;

    constructor(
        private activatedRoute: ActivatedRoute,
        private alertController: AlertController,
        private platform: Platform,
        private router: Router,
        private tuplesService: TuplesService,
        private tupleItemsService: TupleItemsService,
        private usersService: UsersService
    ) {}

    get user() {
        return this.usersService.user;
    }

    get tuple() {
        if (this.tupleId && this.user) {
            const tuple = this.user.tuples.find((t) => t.id === this.tupleId);

            if (tuple) {
                return tuple;
            } else {
                this.router.navigateByUrl("/error", { skipLocationChange: true });
            }
        }
    }

    get isTupleTypeCheckbox() {
        return this.tuple.type === TupleType.checkbox;
    }

    get isInputDisabled() {
        return (
            this.isCreatingTupleItem ||
            this.isDeletingTuple ||
            this.isDeletingTupleItem ||
            this.isUpdatingTupleName ||
            this.isUpdatingTupleItemValue ||
            this.isUpdatingTupleType ||
            this.showTupleNameInput ||
            this.showTupleItemValueInputId > -1
        );
    }

    get isAddingTupleItem() {
        return this.isCreatingTupleItem && this.creatingTupleItemAfterTupleItemId === -1;
    }

    get hideTupleEndButtons() {
        return this.platform.width() < 768 && this.showTupleNameInput;
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

    @HostListener("window:resize")
    resizeEvent() {
        this.platformWidth = this.platform.width();
    }

    ngOnInit() {
        this.resizeEvent();
        this.tupleId = toInteger(this.activatedRoute.snapshot.paramMap.get("id"));
    }

    async deleteTuple() {
        const alert = await this.alertController.create({
            message: "Please confirm tuple deletion. This action is irreversible.",
            buttons: [
                {
                    text: "Delete",
                    cssClass: "alert-button-danger",
                    handler: async () => {
                        this.isDeletingTuple = true;
                        await this.tuplesService.delete(this.tuple.id);
                        this.router.navigateByUrl("/");
                        this.isDeletingTuple = false;
                    }
                },
                {
                    text: "Cancel",
                    role: "cancel"
                }
            ]
        });

        await alert.present();
    }

    toggleTupleNameInput() {
        this.tupleNameInput = this.tuple.name;
        this.showTupleNameInput = true;
        this.inputElementFocus();
    }

    async updateTupleName() {
        const { id, name } = this.tuple;

        if (name !== this.tupleNameInput) {
            this.isUpdatingTupleName = true;
            await this.tuplesService.update(id, { name: this.tupleNameInput });
            this.tuple.name = this.tupleNameInput;
        }

        this.showTupleNameInput = false;
        this.isUpdatingTupleName = false;
    }

    async updateTupleType() {
        this.isUpdatingTupleType = true;
        const { id, type } = this.tuple;
        const newType = type === TupleType.checkbox ? TupleType.list : TupleType.checkbox;
        await this.tuplesService.update(id, { type: newType });
        this.tuple.type = newType;
        this.isUpdatingTupleType = false;
    }

    async createTupleItem(afterTupleItemId?: number) {
        const { id, tupleItems } = this.tuple;
        let order = tupleItems.length;
        this.isCreatingTupleItem = true;

        if (afterTupleItemId) {
            this.creatingTupleItemAfterTupleItemId = afterTupleItemId;
            order = tupleItems.findIndex((tupleItem) => tupleItem.id === afterTupleItemId) + 1;
        }

        await this.tupleItemsService.create(id, order);
        this.isCreatingTupleItem = false;
        this.creatingTupleItemAfterTupleItemId = -1;
    }

    toggleTupleItemValueInput(tupleItem: TupleItem) {
        const { id, value } = tupleItem;
        this.tupleItemValueInput = value;
        this.showTupleItemValueInputId = id;
        this.inputElementFocus();
    }

    showTupleItemValueInput(id: number) {
        return this.showTupleItemValueInputId === id;
    }

    async updateTupleItemValue() {
        const index = this.tuple.tupleItems.findIndex(
            (tupleItem) => tupleItem.id === this.showTupleItemValueInputId
        );
        const { id, value } = this.tuple.tupleItems[index];

        if (value !== this.tupleItemValueInput) {
            this.isUpdatingTupleItemValue = true;
            await this.tupleItemsService.update(id, { value: this.tupleItemValueInput });
            this.tuple.tupleItems[index].value = this.tupleItemValueInput;
        }

        this.showTupleItemValueInputId = -1;
        this.isUpdatingTupleItemValue = false;
    }

    async updateTupleItemChecked(tupleItem: TupleItem) {
        const { id, isChecked } = tupleItem;
        const isCheckedUpdated = !isChecked;
        tupleItem.isChecked = isCheckedUpdated;
        await this.tupleItemsService.update(id, { isChecked: isCheckedUpdated });
    }

    async deleteTupleItem(id: number) {
        this.isDeletingTupleItem = true;
        this.deletingTupleItemId = id;
        await this.tupleItemsService.delete(id);
        this.isDeletingTupleItem = false;
        this.deletingTupleItemId = -1;
    }

    async reorder(event: any) {
        const tupleItems = event.detail.complete(this.tuple.tupleItems);

        for (let i = 0; i < tupleItems.length; i++) {
            tupleItems[i] = { id: tupleItems[i].id, order: i };
        }

        await this.tupleItemsService.reorder(this.tuple.id, tupleItems);
    }

    handleInputElementFocusOut() {
        setTimeout(() => {
            if (this.showTupleNameInput && !this.isUpdatingTupleName) {
                this.updateTupleName();
            } else if (this.showTupleItemValueInputId > -1 && !this.isUpdatingTupleItemValue) {
                this.updateTupleItemValue();
            }
        }, 150);
    }

    private inputElementFocus() {
        setTimeout(() => {
            if (this.inputElement) {
                this.inputElement.nativeElement.focus();
            }
        }, 150);
    }
}
