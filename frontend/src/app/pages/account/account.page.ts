import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { AlertController, IonModal } from "@ionic/angular";
import { upperFirst } from "lodash";
import { Subscription } from "rxjs";

import { AppComponent } from "../../app.component";
import { DevicesService } from "../../services/resources/devices/devices.service";
import {
    FriendRequest,
    FriendRequestsService
} from "../../services/resources/friend-requests/friend-requests.service";
import { UsersService } from "../../services/resources/users/users.service";
import { StorageKey, StorageService } from "../../services/utils/storage/storage.service";

@Component({
    selector: "app-account",
    templateUrl: "./account.page.html",
    styleUrls: ["./account.page.scss"]
})
export class AccountPage implements OnInit, OnDestroy {
    @ViewChild("friendRequestModal") friendRequestModal: IonModal;
    @ViewChild("input") inputElement: ElementRef;

    readonly maxDeviceValues = Array.from({ length: 5 }, (_, i) => i + 1);
    readonly maxFriendValues = Array.from({ length: 11 }, (_, i) => i);

    canUpdateMaxDevices = true;
    canUpdateMaxFriends = true;
    currentDeviceId: string;
    friendRequestUsername = "";
    friendsView: "friends" | "requests" = "friends";
    isPresentingFriendRequestModal = false;
    isSendingFriendRequest = false;
    isUpdatingUsername = false;
    maxDevices: number;
    maxFriends: number;
    showUsernameInput = false;
    updatingDeviceId: string;
    usernameInput: string;

    private usersServiceChangeEventSubscription: Subscription;

    constructor(
        private alertController: AlertController,
        private devicesService: DevicesService,
        private friendRequestsService: FriendRequestsService,
        private storageService: StorageService,
        private usersService: UsersService
    ) {}

    get isSmallScreen() {
        return AppComponent.isSmallScreen;
    }

    get showProgressBar() {
        return AppComponent.showProgressBar;
    }

    get user() {
        return this.usersService.user;
    }

    get userHasPendingFriendRequest() {
        const { friendRequests, username } = this.user;
        return friendRequests.find(
            (friendRequest) =>
                friendRequest.requestee.username === username && friendRequest.status === "Pending"
        );
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
        if (this.usersServiceChangeEventSubscription) {
            this.usersServiceChangeEventSubscription.unsubscribe();
        }
    }

    ngOnInit() {
        this.setData();
        this.usersServiceChangeEventSubscription = this.usersService.changeEvent.subscribe(() => {
            console.log(this.user);
            if (this.user) {
                if (this.maxDevices !== this.user.maxDevices) {
                    this.canUpdateMaxDevices = false;
                    this.maxDevices = this.user.maxDevices;
                    setTimeout(() => (this.canUpdateMaxDevices = true), 250);
                }

                if (this.maxFriends !== this.user.maxFriends) {
                    this.canUpdateMaxFriends = false;
                    this.maxFriends = this.user.maxFriends;
                    setTimeout(() => (this.canUpdateMaxFriends = true), 250);
                }
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
                            await this.devicesService.delete(id);
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

    async deleteFriendRequest(id: string) {
        (
            await this.alertController.create({
                message: "Please confirm friend request deletion. This action is irreversible.",
                buttons: [
                    {
                        text: "Delete",
                        cssClass: "alert-button-danger",
                        handler: async () => {
                            await this.friendRequestsService.delete(id);
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
                            await this.usersService.delete();
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

    isUserRequestee(friendRequest: FriendRequest) {
        return this.user.username === friendRequest.requestee.username;
    }

    getCreatedDateString(createdAt: Date) {
        return createdAt.toLocaleDateString();
    }

    getCreatedTimeString(createdAt: Date) {
        return createdAt.toLocaleTimeString().replace(/(.*)\D\d+/, "$1");
    }

    getDeviceInfoString(info: string) {
        return info === "ios" ? "iOS" : upperFirst(info);
    }

    handleInputElementFocusOut() {
        setTimeout(() => {
            if (this.showUsernameInput && !this.isUpdatingUsername) {
                this.updateUsername();
            } else if (this.isPresentingFriendRequestModal) {
                this.sendFriendRequest();
            }
        }, 100);
    }

    async sendFriendRequest() {
        this.isSendingFriendRequest = true;
        const created = await this.friendRequestsService.create(this.friendRequestUsername);

        if (created) {
            this.friendRequestModal.dismiss();
        }

        this.isSendingFriendRequest = false;
    }

    toggleUsernameInput() {
        this.usernameInput = this.user.username;
        this.showUsernameInput = true;
        this.inputElementFocus();
    }

    async updateFriendRequestAcceptance(friendRequest: FriendRequest) {
        const { id, status } = friendRequest;

        let message = `
        This friend request was previously rejected.
        Please accept the request to add the user to tuples and vice versa.
        You can accept this request at any time.`;
        const buttons = [
            {
                text: "Accept",
                cssClass: "alert-button-primary",
                handler: async () => {
                    await this.friendRequestsService.acceptance(id, true);
                }
            },
            {
                text: "Cancel",
                role: "cancel",
                cssClass: "alert-button-cancel"
            }
        ];

        if (status === "Pending") {
            message = `
            Please accept or reject the friend request.
            Accepting the request will allow you to add the user to tuples and vice versa.
            You can accept a previously rejected request at any time.`;
            buttons.splice(1, 0, {
                text: "Reject",
                cssClass: "alert-button-danger",
                handler: async () => {
                    await this.friendRequestsService.acceptance(id, false);
                }
            });
        }

        (await this.alertController.create({ message, buttons })).present();
    }

    async updateMaxDevices() {
        if (this.maxDevices !== this.user.maxDevices && this.canUpdateMaxDevices) {
            const updated = await this.usersService.update({ maxDevices: this.maxDevices });

            if (updated) {
                this.user.maxDevices = this.maxDevices;
            }

            setTimeout(() => {
                if (!updated) {
                    this.maxDevices = this.user.maxDevices;
                }
            }, 500);
        }
    }

    async updateMaxFriends() {
        if (this.maxFriends !== this.user.maxFriends && this.canUpdateMaxFriends) {
            const updated = await this.usersService.update({ maxFriends: this.maxFriends });

            if (updated) {
                this.user.maxFriends = this.maxFriends;
            } else {
                setTimeout(() => (this.maxFriends = this.user.maxFriends), 500);
            }
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
                    "Please verify or delete the device. Verifying the device will give it full access to your account and tuples.",
                buttons: [
                    {
                        text: "Verify",
                        cssClass: "alert-button-primary",
                        handler: async () => {
                            await this.devicesService.verify(id);
                        }
                    },
                    {
                        text: "Delete",
                        cssClass: "alert-button-danger",
                        handler: async () => {
                            await this.devicesService.delete(id);
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
        } else {
            if (this.maxDevices === undefined) {
                this.maxDevices = this.user.maxDevices;
            }

            if (this.maxFriends === undefined) {
                this.maxFriends = this.user.maxFriends;
            }
        }
    }
}
