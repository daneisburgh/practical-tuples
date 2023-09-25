import { Component, HostListener, ViewChild } from "@angular/core";
import { AlertController, IonInput, IonModal } from "@ionic/angular";

import { AppComponent } from "../../app.component";
import { DevicesService } from "../../services/resources/devices/devices.service";
import { Tuple, TuplesService, TupleType } from "../../services/resources/tuples/tuples.service";
import { UsersService } from "../../services/resources/users/users.service";

@Component({
    selector: "app-home",
    templateUrl: "home.page.html",
    styleUrls: ["home.page.scss"]
})
export class HomePage {
    @ViewChild("addDeviceModal") addDeviceModal: IonModal;
    @ViewChild("input") inputElement: IonInput;

    addDeviceToAccountUsername = "";
    isAddingDeviceToAccount = false;
    isPresentingAddDeviceToAccountModal = false;

    constructor(
        private alertController: AlertController,
        private devicesService: DevicesService,
        private tuplesService: TuplesService,
        private usersService: UsersService
    ) {}

    get isCreatingAccount() {
        return AppComponent.isCreatingAccount;
    }

    get requestId() {
        return this.usersService.requestId;
    }

    get showProgressBar() {
        return AppComponent.showProgressBar;
    }

    get user() {
        return this.usersService.user;
    }

    get isUserConnecting() {
        return this.usersService.isConnecting;
    }

    @HostListener("document:keydown", ["$event"])
    keyboardEvent(event: KeyboardEvent) {
        const { key } = event;

        switch (key) {
            case "Enter":
                if (this.isPresentingAddDeviceToAccountModal) {
                    this.addDeviceToAccount();
                }
                break;
        }
    }

    async addDeviceToAccount() {
        this.isAddingDeviceToAccount = true;
        const created = await this.devicesService.create(this.addDeviceToAccountUsername);

        if (created) {
            this.addDeviceModal.dismiss();
        }

        this.isAddingDeviceToAccount = false;
    }

    async confirmCreateNewAccount() {
        (
            await this.alertController.create({
                message:
                    "Please confirm new account creation. This action will remove all of the account data from this device and is irreversible.",
                buttons: [
                    {
                        text: "Confirm",
                        cssClass: "alert-button-primary",
                        handler: async () => {
                            await this.createAccount();
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

    async createAccount() {
        AppComponent.isCreatingAccount = true;
        const created = await this.usersService.create();

        if (created) {
            await this.createTuple();
        }

        AppComponent.isCreatingAccount = false;
    }

    async createTuple() {
        await this.tuplesService.create();
    }

    async deleteTuple(id: number) {
        (
            await this.alertController.create({
                message: "Please confirm tuple deletion. This action is irreversible.",
                buttons: [
                    {
                        text: "Delete",
                        cssClass: "alert-button-danger",
                        handler: async () => {
                            await this.tuplesService.delete(id);
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

    getTupleItemsString(tuple: Tuple) {
        const { tupleItems, type } = tuple;
        let tupleItemsString = tupleItems.length.toString();

        if (tupleItems.length > 0 && type === TupleType.checkbox) {
            const checked = tupleItems.filter((tupleItem) => tupleItem.isChecked).length;
            tupleItemsString += ` (${checked} checked)`;
        }

        return tupleItemsString;
    }

    getTupleUpdatedString(tuple: Tuple) {
        return AppComponent.getDateString(tuple.updatedAt);
    }

    handleIonModalWillPresent() {
        this.isPresentingAddDeviceToAccountModal = true;
        this.inputElementFocus();
    }

    async refreshAccount() {
        await this.usersService.connect();
    }

    private inputElementFocus() {
        setTimeout(() => {
            if (this.inputElement) {
                this.inputElement.setFocus();
            }
        }, 500);
    }
}
