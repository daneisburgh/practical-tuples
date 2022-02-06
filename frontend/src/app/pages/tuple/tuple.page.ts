import { Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertController } from "@ionic/angular";
import { remove, toInteger } from "lodash";

import { Tuple, TuplesService, TupleType } from "../../services/resources/tuples/tuples.service";
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

    creatingTupleItem = false;
    creatingTupleItemAfterTupleItemId = -1;
    deletingTuple = false;
    deletingTupleItem = false;
    deletingTupleItemId = -1;
    showTupleNameInput = false;
    showTupleItemValueInputId = -1;
    tuple: Tuple;
    tupleNameInput: string;
    tupleItemValueInput: string;
    updatingTupleName = false;
    updatingTupleType = false;
    updatingTupleItemValue = false;

    constructor(
        private activatedRoute: ActivatedRoute,
        private alertController: AlertController,
        private router: Router,
        private usersService: UsersService,
        private tuplesService: TuplesService,
        private tupleItemsService: TupleItemsService
    ) {}

    get user() {
        return this.usersService.user;
    }

    get isTupleTypeCheckbox() {
        return this.tuple.type === TupleType.checkbox;
    }

    @HostListener("document:keydown", ["$event"])
    keyboardEvent(event: KeyboardEvent) {
        const { key } = event;

        switch (key) {
            case "Enter":
                if (this.showTupleNameInput) {
                    this.updateTupleName();
                } else if (this.showTupleItemValueInputId > -1) {
                    this.updateTupleItemValue();
                }
                break;
            case "Escape":
                if (this.showTupleNameInput) {
                    this.showTupleNameInput = false;
                } else if (this.showTupleItemValueInputId > -1) {
                    this.showTupleItemValueInputId = -1;
                }
                break;
        }
    }

    ngOnInit() {
        const id = toInteger(this.activatedRoute.snapshot.paramMap.get("id"));

        if (this.user) {
            const tuple = this.user.tuples.find((t) => t.id === id);

            if (!tuple) {
                this.router.navigateByUrl("/error", { skipLocationChange: true });
            } else {
                this.tuple = tuple;
            }
        }
    }

    async deleteTuple() {
        const alert = await this.alertController.create({
            message: "Please confirm tuple deletion. This action is irreversible.",
            buttons: [
                {
                    text: "Delete",
                    cssClass: "alert-button-danger",
                    handler: async () => {
                        this.deletingTuple = true;
                        await this.tuplesService.delete(this.tuple.id);
                        this.router.navigateByUrl("/");
                        this.deletingTuple = false;
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
            this.updatingTupleName = true;
            await this.tuplesService.update(id, { name: this.tupleNameInput });
            this.tuple.name = this.tupleNameInput;
            this.showTupleNameInput = false;
            this.updatingTupleName = false;
        }
    }

    async updateTupleType() {
        this.updatingTupleType = true;
        const { id, type } = this.tuple;
        const newType = type === TupleType.checkbox ? TupleType.list : TupleType.checkbox;
        await this.tuplesService.update(id, { type: newType });
        this.tuple.type = newType;
        this.updatingTupleType = false;
    }

    async createTupleItem(afterTupleItemId?: number) {
        const { id, tupleItems } = this.tuple;
        let order = tupleItems.length;

        if (afterTupleItemId) {
            this.creatingTupleItemAfterTupleItemId = afterTupleItemId;
            order = tupleItems.findIndex((tupleItem) => tupleItem.id === afterTupleItemId) + 1;
        } else {
            this.creatingTupleItem = true;
        }

        const newTupleItem = await this.tupleItemsService.create(id, order);
        this.tuple.tupleItems.splice(order, 0, newTupleItem);
        this.creatingTupleItem = false;
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
            this.updatingTupleItemValue = true;
            await this.tupleItemsService.update(id, { value: this.tupleItemValueInput });
            this.tuple.tupleItems[index].value = this.tupleItemValueInput;
            this.showTupleItemValueInputId = -1;
            this.updatingTupleItemValue = false;
        }
    }

    async updateTupleItemChecked(tupleItem: TupleItem) {
        const { id, isChecked } = tupleItem;
        const isCheckedUpdated = !isChecked;
        tupleItem.isChecked = isCheckedUpdated;
        await this.tupleItemsService.update(id, { isChecked: isCheckedUpdated });
    }

    async deleteTupleItem(id: number) {
        this.deletingTupleItemId = id;
        await this.tupleItemsService.delete(id);
        remove(this.tuple.tupleItems, (tupleItem) => tupleItem.id === id);
    }

    async reorder(event: any) {
        const tupleItems = event.detail.complete(this.tuple.tupleItems);

        for (let i = 0; i < tupleItems.length; i++) {
            tupleItems[i] = { id: tupleItems[i].id, order: i };
        }

        await this.tupleItemsService.batchUpdate(this.tuple.id, tupleItems);
    }

    handleInputElementFocusOut() {
        if (this.showTupleNameInput) {
            if (this.tuple.name !== this.tupleNameInput) {
                this.updateTupleName();
            } else {
                this.showTupleNameInput = false;
            }
        } else if (this.showTupleItemValueInputId > -1) {
            const index = this.tuple.tupleItems.findIndex(
                (tupleItem) => tupleItem.id === this.showTupleItemValueInputId
            );

            if (this.tuple.tupleItems[index].value !== this.tupleItemValueInput) {
                this.updateTupleItemValue();
            } else {
                this.showTupleItemValueInputId = -1;
            }
        }
    }

    private inputElementFocus() {
        setTimeout(() => {
            if (this.inputElement) {
                this.inputElement.nativeElement.focus();
            }
        }, 200);
    }
}
