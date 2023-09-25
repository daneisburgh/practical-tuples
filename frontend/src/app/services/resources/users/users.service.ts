import { EventEmitter, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Device as CapacitorDevice } from "@capacitor/device";
import { orderBy } from "lodash";

import { Device } from "../devices/devices.service";
import { Tuple } from "../tuples/tuples.service";
import { HttpService } from "../../utils/http/http.service";
import { StorageKey, StorageService } from "../../utils/storage/storage.service";
import { ToastService } from "../../utils/toast/toast.service";
import { WebSocketService } from "../../utils/websocket/websocket.service";
import { FriendRequest } from "../friend-requests/friend-requests.service";

const route = "/users";

export type User = {
    createdAt: Date;
    updatedAt: Date;
    username: string;
    requestId: string;
    isOnline: boolean;
    friends: (Pick<FriendRequest, "id" | "updatedAt"> & Pick<User, "username">)[];
    friendRequests: FriendRequest[];
    tuples: Tuple[];
    devices: Device[];
    maxDevices: number;
    maxFriends: number;
};

@Injectable({
    providedIn: "root"
})
export class UsersService {
    connectionEvent = new EventEmitter<void>();
    changeEvent = new EventEmitter<void>();
    isConnecting = false;
    requestId: string;
    user?: User;

    private unableToLogInToast: HTMLIonToastElement;

    constructor(
        private httpService: HttpService,
        private router: Router,
        private storageService: StorageService,
        private toastService: ToastService,
        private webSocketService: WebSocketService
    ) {
        this.setUser();

        this.webSocketService.connectionEvent.subscribe((event) => {
            if (event === "connectionId") {
                this.connect();
            }
        });

        this.webSocketService.userEvent.subscribe(async (userEvent) => {
            const { updateUser, deleteUser } = userEvent;

            if (updateUser) {
                await this.setUser(updateUser);
            } else if (deleteUser) {
                this.logout();
            }
        });
    }

    async connect() {
        this.isConnecting = true;
        this.requestId = await this.storageService.get(StorageKey.requestId);

        if (this.unableToLogInToast) {
            this.unableToLogInToast.dismiss();
        }

        if (this.requestId) {
            try {
                const user = await this.httpService.patch(`${route}/connect`);
                await this.setUser(user);
            } catch (error) {
                console.error(error);
                let errorMessage = `Unable to log in to the account associated with this device.
                Please refresh to try again.`;

                if (error.error.message === "Invalid device") {
                    this.logout();
                    errorMessage =
                        "This device has been removed from the account by another device";
                }

                this.unableToLogInToast = await this.toastService.present("danger", errorMessage);
            }
        } else if (this.user) {
            this.logout();
        }

        this.isConnecting = false;
        this.connectionEvent.emit();
    }

    async create() {
        let created = false;

        try {
            const response = await this.httpService.post(route, {
                deviceInfo: await CapacitorDevice.getInfo()
            });

            if (response) {
                await this.setUser(response);
                await this.storageService.set(StorageKey.requestId, response.requestId);
                created = true;
            }
        } catch (error) {
            console.error(error);
            await this.toastService.present("danger", "Unable to create an account");
        }

        return created;
    }

    async delete() {
        try {
            const response = await this.httpService.delete(route);

            if (response) {
                await this.logout();
            }
        } catch (error) {
            console.error(error);
            await this.toastService.present("danger", "Unable to delete account");
        }
    }

    async update(user: Partial<User>) {
        let updated = false;

        try {
            const response = await this.httpService.patch(route, user);

            if (response) {
                this.setUser(response);
                updated = true;
            }
        } catch (error) {
            console.error(error);

            const {
                error: { message }
            } = error;
            let errorMessage = "Unable to update account";

            switch (message) {
                case "Username is taken":
                case "New username cannot start with 'User'":
                    errorMessage = message;
                    break;
            }

            await this.toastService.present("danger", errorMessage);
        }

        return updated;
    }

    async logout() {
        this.requestId = undefined;
        this.user = undefined;
        await this.storageService.remove(StorageKey.requestId);
        await this.storageService.remove(StorageKey.user);
        this.router.navigateByUrl("/");
        this.changeEvent.emit();
    }

    async setUser(user?: User) {
        console.log(user);
        if (!user) {
            const userString = await this.storageService.get(StorageKey.user);
            user = userString ? JSON.parse(userString) : undefined;
        }

        if (user) {
            user = this.httpService.mapDateValues(user);
            user.devices = orderBy(user.devices, "createdAt", "asc");
            user.tuples = orderBy(user.tuples, "updatedAt", "desc");
            user.friends = orderBy(user.friends, "updatedAt", "desc");
            user.friendRequests = orderBy(user.friendRequests, "createdAt", "desc");

            for (const tuple of user.tuples) {
                tuple.tupleItems = orderBy(tuple.tupleItems, "order", "asc");
            }

            // if (this.user) {
            //     merge(this.user, user);
            // } else {
            //     this.user = user;
            // }
            this.user = user;

            await this.storageService.set(StorageKey.user, JSON.stringify(user));
            this.changeEvent.emit();
        }
    }
}
