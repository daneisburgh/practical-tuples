import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    OnInit,
    ViewChild
} from "@angular/core";
import { AlertController } from "@ionic/angular";
import { remove, upperFirst } from "lodash";

import { AppComponent } from "../../app.component";
import { DevicesService } from "../../shared/services/resources/devices/devices.service";
import { UsersService } from "../../shared/services/resources/users/users.service";
import { StorageKey, StorageService } from "../../shared/services/utils/storage/storage.service";
import { ToastService } from "../../shared/services/utils/toast/toast.service";

@Component({
    selector: "app-account",
    templateUrl: "./account.page.html",
    styleUrls: ["./account.page.scss"]
})
export class AccountPage implements OnInit, AfterViewInit {
    @ViewChild("input") inputElement: ElementRef;

    readonly maxDeviceValues = [1, 2, 3];

    currentDeviceId: string;
    isDeletingDevice = false;
    isDeletingUser = false;
    isUpdatingMaxDevices = false;
    isUpdatingUsername = false;
    isVerifyingDevice = false;
    maxDevices: number;
    showUsernameInput = false;
    updatingDeviceId: string;
    usernameInput: string;

    constructor(
        private alertController: AlertController,
        private devicesService: DevicesService,
        private storageService: StorageService,
        private toastService: ToastService,
        private usersService: UsersService
    ) {}

    get isInputDisabled() {
        const isInputDisabled =
            this.isDeletingDevice ||
            this.isDeletingUser ||
            this.isUpdatingMaxDevices ||
            this.isUpdatingUsername ||
            this.isVerifyingDevice;
        AppComponent.showProgressBar = isInputDisabled;
        return isInputDisabled;
    }

    get isSmallScreen() {
        return AppComponent.isSmallScreen;
    }

    get showAccountPopoverTrigger() {
        return !this.isDeletingUser && !this.isUpdatingUsername;
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
                this.showUsernameInput = false;
                break;
        }
    }

    ngOnInit() {
        this.setCurrentDeviceId();
    }

    ngAfterViewInit() {
        if (this.user) {
            this.maxDevices = this.user.maxDevices;
            this.usersService.changeEvent.subscribe(() => (this.maxDevices = this.user.maxDevices));
        }
    }

    async deleteDevice(id: string) {
        (
            await this.alertController.create({
                message: "Please confirm device deletion. This action is irreversible.",
                buttons: [
                    {
                        text: "Delete",
                        cssClass: "alert-button-danger",
                        handler: async () => {
                            await this.confirmedDeleteDevice(id);
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

    async deleteUser() {
        (
            await this.alertController.create({
                message: "Please confirm account deletion. This action is irreversible.",
                buttons: [
                    {
                        text: "Delete",
                        cssClass: "alert-button-danger",
                        handler: async () => {
                            this.isDeletingUser = true;

                            try {
                                await this.usersService.delete();
                            } catch (error) {
                                console.error(error);
                                this.toastService.present("danger", "Unable to delete user");
                            }

                            this.isDeletingUser = false;
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

    isCurrentDevice(id: string) {
        return this.currentDeviceId === id;
    }

    isUpdatingDevice(id: string) {
        return this.updatingDeviceId === id;
    }

    getDeviceCreatedDateString(createdAt: Date) {
        return createdAt.toLocaleDateString();
    }

    getDeviceCreatedTimeString(createdAt: Date) {
        return createdAt.toLocaleTimeString().replace(/(.*)\D\d+/, "$1");
    }

    getDeviceInfoString(info: string) {
        return info === "ios" ? "iOS" : upperFirst(info);
    }

    handleInputElementFocusOut() {
        setTimeout(() => {
            if (this.showUsernameInput && !this.isUpdatingUsername) {
                this.updateUsername();
            }
        }, 100);
    }

    toggleUsernameInput() {
        this.usernameInput = this.user.username;
        this.showUsernameInput = true;
        this.inputElementFocus();
    }

    async updateMaxDevices() {
        if (!this.isUpdatingMaxDevices) {
            this.isUpdatingMaxDevices = true;

            try {
                await this.usersService.update({ maxDevices: this.maxDevices });
                this.user.maxDevices = this.maxDevices;
            } catch (error) {
                console.error(error);
                this.maxDevices = this.user.maxDevices;
                this.toastService.present("danger", "Unable to update max devices");
            }

            setTimeout(() => {
                AppComponent.showProgressBar = false;
                this.isUpdatingMaxDevices = false;
            }, 250);
        }
    }

    async updateUsername() {
        const { username } = this.user;

        if (username !== this.usernameInput) {
            this.isUpdatingUsername = true;

            try {
                await this.usersService.update({ username: this.usernameInput });
                this.user.username = this.usernameInput;
                this.showUsernameInput = false;
            } catch (error) {
                console.error(error);

                const {
                    error: { message }
                } = error;
                let errorMessage = "Unable to update username";

                switch (message) {
                    case "Username it taken":
                    case "New username cannot start with 'User'":
                        errorMessage = message;
                        break;
                }

                this.toastService.present("danger", errorMessage);
            }

            this.isUpdatingUsername = false;
        }
    }

    async verifyDevice(id: string) {
        (
            await this.alertController.create({
                message:
                    "Please verify or delete device. Verifying the device will give it full access to your account and tuples.",
                buttons: [
                    {
                        text: "Verify",
                        cssClass: "alert-button-primary",
                        handler: async () => {
                            this.isVerifyingDevice = true;

                            try {
                                await this.devicesService.update(id, { isVerified: true });
                            } catch (error) {
                                console.error(error);
                                this.toastService.present("danger", "Unable to verify device");
                            }

                            this.isVerifyingDevice = false;
                        }
                    },
                    {
                        text: "Delete",
                        cssClass: "alert-button-danger",
                        handler: async () => {
                            await this.confirmedDeleteDevice(id);
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

    private inputElementFocus() {
        setTimeout(() => {
            if (this.inputElement) {
                this.inputElement.nativeElement.focus();
            }
        }, 250);
    }

    private async setCurrentDeviceId() {
        this.currentDeviceId = await this.storageService.get(StorageKey.deviceId);
    }

    private async confirmedDeleteDevice(id: string) {
        this.isDeletingDevice = true;

        try {
            await this.devicesService.delete(id);
            remove(this.usersService.user.devices, (device) => device.id === id);
        } catch (error) {
            console.error(error);
            this.toastService.present("danger", "Unable to delete device");
        }

        this.isDeletingDevice = false;
    }
}
