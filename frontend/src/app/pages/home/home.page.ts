import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController, IonModal } from "@ionic/angular";

import { AppComponent } from "../../app.component";
import { DevicesService } from "../../services/resources/devices/devices.service";
import { Tuple, TuplesService, TupleType } from "../../services/resources/tuples/tuples.service";
import { UsersService } from "../../services/resources/users/users.service";
import { StorageKey, StorageService } from "../../services/utils/storage/storage.service";
import { ToastService } from "../../services/utils/toast/toast.service";

@Component({
    selector: "app-home",
    templateUrl: "home.page.html",
    styleUrls: ["home.page.scss"]
})
export class HomePage implements OnInit {
    @ViewChild("addDeviceModal") addDeviceModal: IonModal;

    addDeviceToAccountUsername = "";
    deletingTupleId = -1;
    isAddingDeviceToAccount = false;
    isCreatingTuple = false;
    isDeletingTuple = false;
    isPresentingAddDeviceToAccountModal = false;
    isRefreshingAccount = false;
    requestId: string;
    updatingTupleId = -1;

    constructor(
        private alertController: AlertController,
        private devicesService: DevicesService,
        private router: Router,
        private storageService: StorageService,
        private toastService: ToastService,
        private tuplesService: TuplesService,
        private usersService: UsersService
    ) {}

    get isInputDisabled() {
        const isInputDisabled =
            this.deletingTupleId > -1 ||
            this.isCreatingAccount ||
            this.isCreatingTuple ||
            this.isRefreshingAccount ||
            this.updatingTupleId > -1;

        AppComponent.showProgressBar = isInputDisabled;
        return isInputDisabled || this.isAddingDeviceToAccount;
    }

    get isCreatingAccount() {
        return AppComponent.isCreatingAccount;
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

    ngOnInit() {
        this.setRequestId();
    }

    async addDeviceToAccount() {
        this.isAddingDeviceToAccount = true;

        try {
            await this.devicesService.create(this.addDeviceToAccountUsername);
            this.toastService.present(
                "primary",
                `This device has been added to the account.
                Please verify the device in the Account page of an active device to continue.`
            );
            this.addDeviceModal.dismiss();
        } catch (error) {
            console.error(error);

            const {
                error: { message }
            } = error;
            let errorMessage = "Unable to add device to account";

            switch (message) {
                case "Username not found":
                case "Account has maximum allowed devices":
                case "Device already associated with account":
                case "Device associated with another account":
                    errorMessage = message;
                    break;
            }

            this.toastService.present("danger", errorMessage);
        }

        this.isAddingDeviceToAccount = false;
    }

    async confirmCreateNewAccount() {
        (
            await this.alertController.create({
                message: "Please confirm new account creation. This action is irreversible.",
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

        try {
            await this.usersService.create();
            await this.createTuple();
        } catch (error) {
            console.error(error);
            this.toastService.present("danger", "Unable to create an account");
        }

        AppComponent.isCreatingAccount = false;
        AppComponent.showProgressBar = false;
    }

    async createTuple() {
        this.isCreatingTuple = true;

        try {
            const { id } = await this.tuplesService.create();
            this.router.navigateByUrl("/tuple/" + id);
        } catch (error) {
            console.error(error);
            this.toastService.present("danger", "Unable to create a tuple");
        }

        this.isCreatingTuple = false;
    }

    async deleteTuple(tuple: Tuple) {
        (
            await this.alertController.create({
                message: "Please confirm tuple deletion. This action is irreversible.",
                buttons: [
                    {
                        text: "Delete",
                        cssClass: "alert-button-danger",
                        handler: async () => {
                            this.isDeletingTuple = true;
                            this.deletingTupleId = tuple.id;
                            AppComponent.showProgressBar = true;
                            await this.tuplesService.delete(tuple.id);
                            this.deletingTupleId = -1;
                            this.isDeletingTuple = false;
                            AppComponent.showProgressBar = false;
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
        await this.usersService.connect();
        this.isRefreshingAccount = false;
    }

    private async setRequestId() {
        this.requestId = await this.storageService.get(StorageKey.requestId);
    }
}
