import { Component, HostListener, ViewChild } from "@angular/core";
import { AlertController, IonModal } from "@ionic/angular";

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

    addDeviceToAccountUsername = "";
    deletingTupleId = -1;
    isAddingDeviceToAccount = false;
    isCreatingTuple = false;
    isDeletingTuple = false;
    isPresentingAddDeviceToAccountModal = false;
    isRefreshingAccount = false;
    updatingTupleId = -1;

    constructor(
        private alertController: AlertController,
        private devicesService: DevicesService,
        private tuplesService: TuplesService,
        private usersService: UsersService
    ) {}

    get isInputDisabled() {
        return (
            this.deletingTupleId > -1 ||
            this.isCreatingAccount ||
            this.isCreatingTuple ||
            this.isRefreshingAccount ||
            this.updatingTupleId > -1 ||
            this.isAddingDeviceToAccount
        );
    }

    get isCreatingAccount() {
        return AppComponent.isCreatingAccount;
    }

    get requestId() {
        return this.usersService.requestId;
    }

    get user() {
        return this.usersService.user;
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
        this.isCreatingTuple = true;
        await this.tuplesService.create();
        this.isCreatingTuple = false;
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
                            this.isDeletingTuple = true;
                            this.deletingTupleId = id;
                            await this.tuplesService.delete(id);
                            this.deletingTupleId = -1;
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

    isUpdatingTuple(tuple: Tuple) {
        return this.updatingTupleId === tuple.id;
    }

    async refreshAccount() {
        this.isRefreshingAccount = true;
        AppComponent.showProgressBar = true;
        await this.usersService.connect();
        this.isRefreshingAccount = false;
        AppComponent.showProgressBar = false;
    }
}
