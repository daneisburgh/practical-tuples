import { EventEmitter, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { orderBy, remove } from "lodash";

import { Device, DevicesService } from "../devices/devices.service";
import { Tuple } from "../tuples/tuples.service";
import { HttpService } from "../../utils/http/http.service";
import { StorageKey, StorageService } from "../../utils/storage/storage.service";
import { ToastService } from "../../utils/toast/toast.service";
import { WebSocketService } from "../../utils/websocket/websocket.service";

const route = "/users";

export type User = {
    createdAt: Date;
    updatedAt: Date;
    username: string;
    requestId: string;
    isOnline: boolean;
    tuples: Tuple[];
    devices: Device[];
    maxDevices: number;
};

@Injectable({
    providedIn: "root"
})
export class UsersService {
    connectionEvent = new EventEmitter<void>();
    user?: User;

    private unableToLogInToast: HTMLIonToastElement;

    constructor(
        private devicesService: DevicesService,
        private httpService: HttpService,
        private router: Router,
        private storageService: StorageService,
        private toastService: ToastService,
        private webSocketService: WebSocketService
    ) {
        this.webSocketService.connectionEvent.subscribe((event) => {
            switch (event) {
                case "connectionId":
                    this.connect();
                    break;
                case "disconnected":
                    this.user = undefined;
                    break;
            }
        });

        this.webSocketService.deviceEvent.subscribe(async (deviceEvent) => {
            const { createDevice, updateDevice, deleteDevice } = deviceEvent;
            const currentDeviceId = await this.storageService.get(StorageKey.deviceId);

            if (createDevice || updateDevice) {
                const device = createDevice
                    ? this.httpService.mapDateValues(createDevice)
                    : this.httpService.mapDateValues(updateDevice);

                if (this.user) {
                    const currentDeviceIndex = this.user.devices.findIndex(
                        (d) => d.id === device.id
                    );

                    if (currentDeviceIndex === -1) {
                        this.user.devices.push(device);
                    } else {
                        for (const deviceKey of Object.keys(device)) {
                            this.user.devices[currentDeviceIndex][deviceKey] = device[deviceKey];
                        }
                    }
                } else if (device.id === currentDeviceId && device.isVerified) {
                    this.connect();
                    this.toastService.present("primary", "This device has been verified");
                }
            } else if (deleteDevice) {
                if (deleteDevice.id === currentDeviceId) {
                    this.toastService.present(
                        "danger",
                        "This device has been removed from the account by another device"
                    );
                    this.logout();
                } else {
                    this.user.devices = this.user.devices.filter((d) => d.id !== deleteDevice.id);
                }
            }
        });

        this.webSocketService.tupleEvent.subscribe((tupleEvent) => {
            const { createTuple, updateTuple, deleteTuple } = tupleEvent;
            console.log(tupleEvent);

            if (createTuple) {
                const tuple = this.httpService.mapDateValues(createTuple);
                this.user.tuples.unshift(tuple);
            } else if (deleteTuple) {
                remove(this.user.tuples, (t) => t.id === deleteTuple.id);
            } else if (updateTuple) {
                const tuple = this.httpService.mapDateValues(updateTuple);
                const currentTupleIndex = this.user.tuples.findIndex((t) => t.id === tuple.id);
                const currentTuple = this.user.tuples[currentTupleIndex];

                for (const tupleKey of Object.keys(tuple)) {
                    if (tupleKey !== "tupleItems") {
                        currentTuple[tupleKey] = tuple[tupleKey];
                    } else {
                        for (const [tupleItemIndex, tupleItem] of tuple.tupleItems.entries()) {
                            const currentTupleItemIndex = currentTuple.tupleItems.findIndex(
                                (ti) => ti.id === tupleItem.id
                            );

                            if (currentTupleItemIndex === -1) {
                                this.user.tuples[currentTupleIndex].tupleItems.splice(
                                    tupleItem.order,
                                    0,
                                    tupleItem
                                );
                            } else if (tupleItemIndex !== currentTupleItemIndex) {
                                this.user.tuples[currentTupleIndex].tupleItems[tupleItemIndex] =
                                    tupleItem;
                            } else {
                                const currentTupleItem =
                                    this.user.tuples[currentTupleIndex].tupleItems[
                                        currentTupleItemIndex
                                    ];

                                for (const tupleItemKey of Object.keys(tupleItem)) {
                                    currentTupleItem[tupleItemKey] = tupleItem[tupleItemKey];
                                }
                            }
                        }
                    }
                }
            }
        });

        this.webSocketService.userEvent.subscribe((userEvent) => {
            const { updateUser, deleteUser } = userEvent;

            if (updateUser) {
                const user = this.httpService.mapDateValues(updateUser);

                for (const userKey of Object.keys(user)) {
                    this.user[userKey] = user[userKey];
                }
            } else if (deleteUser) {
                this.logout();
            }
        });
    }

    async connect() {
        const requestId = await this.storageService.get(StorageKey.requestId);

        if (this.unableToLogInToast) {
            this.unableToLogInToast.dismiss();
        }

        if (requestId) {
            try {
                const user = await this.httpService.patch(`${route}/connect`);
                this.setUser(user);
            } catch (error) {
                console.error(error);
                this.router.navigateByUrl("/");
                this.unableToLogInToast = await this.toastService.present(
                    "danger",
                    `Unable to log in to the account associated with this device.
                    Please refresh account to try again.`
                );
            }
        }

        this.connectionEvent.emit();
    }

    async create() {
        const user = await this.httpService.post(route, {
            deviceInfo: this.devicesService.deviceInfo
        });
        this.setUser(user);
        await this.storageService.set(StorageKey.requestId, user.requestId);
    }

    async delete() {
        await this.httpService.delete(route);
        await this.logout();
    }

    async update(user: Partial<User>) {
        await this.httpService.patch(route, user);
    }

    private async logout() {
        await this.storageService.remove(StorageKey.requestId);
        this.user = undefined;
        this.router.navigateByUrl("/");
    }

    private setUser(user: User) {
        if (user) {
            user.devices = orderBy(user.devices, "createdAt", "asc");
            user.tuples = orderBy(user.tuples, "createdAt", "desc");

            for (const tuple of user.tuples) {
                tuple.tupleItems = orderBy(tuple.tupleItems, "order", "asc");
            }

            this.user = user;
        }
    }
}
