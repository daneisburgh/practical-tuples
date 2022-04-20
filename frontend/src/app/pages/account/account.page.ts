import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { AlertController } from "@ionic/angular";
import { upperFirst } from "lodash";
import { Subscription } from "rxjs";

import { AppComponent } from "../../app.component";
import { DevicesService } from "../../services/resources/devices/devices.service";
import { UsersService } from "../../services/resources/users/users.service";
import { StorageKey, StorageService } from "../../services/utils/storage/storage.service";
import { ToastService } from "../../services/utils/toast/toast.service";

@Component({
    selector: "app-account",
    templateUrl: "./account.page.html",
    styleUrls: ["./account.page.scss"]
})
export class AccountPage implements OnInit, OnDestroy {
    @ViewChild("input") inputElement: ElementRef;

    readonly maxDeviceValues = [1, 2, 3];

    canUpdateMaxDevices = true;
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

    private usersServiceChangeEventSubscription: Subscription;

    constructor(
        private alertController: AlertController,
        private devicesService: DevicesService,
        private storageService: StorageService,
        private toastService: ToastService,
        private usersService: UsersService
    ) {}

    get isInputDisabled() {
        return (
            this.isDeletingDevice ||
            this.isDeletingUser ||
            this.isUpdatingMaxDevices ||
            this.isUpdatingUsername ||
            this.isVerifyingDevice
        );
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

    @HostListener("unloaded")
    ngOnDestroy() {
        this.usersServiceChangeEventSubscription.unsubscribe();
    }

    ngOnInit() {
        this.setData();
        this.usersServiceChangeEventSubscription = this.usersService.changeEvent.subscribe(() => {
            if (this.user && this.maxDevices !== this.user.maxDevices) {
                this.canUpdateMaxDevices = false;
                this.maxDevices = this.user.maxDevices;

                setTimeout(() => {
                    this.canUpdateMaxDevices = true;
                }, 250);
            }
        });
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
                            await this.usersService.delete();
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
        if (
            this.maxDevices !== this.user.maxDevices &&
            this.canUpdateMaxDevices &&
            !this.isUpdatingMaxDevices
        ) {
            this.isUpdatingMaxDevices = true;
            const updated = await this.usersService.update({ maxDevices: this.maxDevices });

            if (updated) {
                this.user.maxDevices = this.maxDevices;
            }

            setTimeout(() => {
                if (!updated) {
                    this.maxDevices = this.user.maxDevices;
                }

                this.isUpdatingMaxDevices = false;
            }, 500);
        }
    }

    async updateUsername() {
        const { username } = this.user;

        if (username !== this.usernameInput) {
            this.isUpdatingUsername = true;
            const updated = await this.usersService.update({ username: this.usernameInput });

            if (updated) {
                this.user.username = this.usernameInput;
                this.showUsernameInput = false;
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
                            await this.devicesService.verify(id);
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

    private async setData() {
        this.currentDeviceId =
            this.currentDeviceId ?? (await this.storageService.get(StorageKey.deviceId));

        if (!this.user) {
            await this.usersService.setUser();
        }

        if (this.user && this.maxDevices === undefined) {
            this.maxDevices = this.user.maxDevices;
        }
    }

    private async confirmedDeleteDevice(id: string) {
        this.isDeletingDevice = true;
        await this.devicesService.delete(id);
        this.isDeletingDevice = false;
    }
}
