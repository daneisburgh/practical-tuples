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
    changeEvent = new EventEmitter<"device" | "tuple" | "user">();
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
                        this.user.devices[currentDeviceIndex] = device;
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

            this.user.devices = orderBy(this.user.devices, "createdAt", "asc");
            this.changeEvent.emit("device");
        });

        this.webSocketService.tupleEvent.subscribe((tupleEvent) => {
            const { createTuple, updateTuple, deleteTuple } = tupleEvent;

            if (createTuple) {
                const tuple = this.httpService.mapDateValues(createTuple);
                this.user.tuples.unshift(tuple);
            } else if (deleteTuple) {
                remove(this.user.tuples, (t) => t.id === deleteTuple.id);
            } else if (updateTuple) {
                const tuple = this.httpService.mapDateValues(updateTuple);
                const currentTupleIndex = this.user.tuples.findIndex((t) => t.id === tuple.id);
                this.user.tuples[currentTupleIndex] = tuple;
            }

            this.user.tuples = orderBy(this.user.tuples, "createdAt", "desc");

            for (const tuple of this.user.tuples) {
                tuple.tupleItems = orderBy(tuple.tupleItems, "order", "asc");
            }

            this.changeEvent.emit("tuple");
        });

        this.webSocketService.userEvent.subscribe((userEvent) => {
            const { updateUser, deleteUser } = userEvent;

            if (updateUser) {
                const user = this.httpService.mapDateValues(updateUser);
                this.setUser(user);
            } else if (deleteUser) {
                this.logout();
            }

            this.user = Object.assign({}, this.user);
            this.changeEvent.emit("user");
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

    async logout() {
        await this.storageService.remove(StorageKey.requestId);
        this.user = undefined;
        this.router.navigateByUrl("/");
    }

    async update(user: Partial<User>) {
        await this.httpService.patch(route, user);
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
