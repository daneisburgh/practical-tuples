import { Injectable } from "@angular/core";
import { Device as CapacitorDevice } from "@capacitor/device";
import { remove } from "lodash";

import { HttpService } from "../../utils/http/http.service";
import { StorageKey, StorageService } from "../../utils/storage/storage.service";
import { ToastService } from "../../utils/toast/toast.service";
import { WebSocketService } from "../../utils/websocket/websocket.service";
import { UsersService } from "../users/users.service";
import { AppComponent } from "../../../../app.component";

const route = "/devices";

export type Device = {
    createdAt: Date;
    isVerified: boolean;
    id: string;
    info: {
        operatingSystem: "android" | "ios" | "windows" | "mac" | "unknown";
        platform: "android" | "ios" | "web";
    };
};

@Injectable({
    providedIn: "root"
})
export class DevicesService {
    constructor(
        private httpService: HttpService,
        private storageService: StorageService,
        private toastService: ToastService,
        private usersService: UsersService,
        private webSocketService: WebSocketService
    ) {
        this.setDeviceId();
        this.webSocketService.deviceEvent.subscribe(async (deviceEvent) => {
            const { createDevice, updateDevice, deleteDevice } = deviceEvent;
            const currentDeviceId = await this.storageService.get(StorageKey.deviceId);
            const user = this.usersService.user
                ? Object.assign({}, this.usersService.user)
                : undefined;

            if (createDevice || updateDevice) {
                const device = createDevice ?? updateDevice;

                if (user) {
                    const currentDeviceIndex = user.devices.findIndex((d) => d.id === device.id);

                    if (currentDeviceIndex === -1) {
                        user.devices.push(device);
                    } else {
                        user.devices[currentDeviceIndex] = device;
                    }
                } else if (device.id === currentDeviceId && device.isVerified) {
                    this.usersService.connect();
                    await this.toastService.present("primary", "This device has been verified");
                }
            } else if (deleteDevice) {
                if (deleteDevice.id === currentDeviceId) {
                    await this.toastService.present(
                        "danger",
                        "This device has been removed from the account by another device"
                    );
                    this.usersService.logout();
                } else if (user) {
                    user.devices = user.devices.filter((d) => d.id !== deleteDevice.id);
                }
            }

            await this.usersService.setUser(user);
            this.usersService.changeEvent.emit("device");
        });
    }

    async create(username: string) {
        let created = false;

        try {
            const response = await this.httpService.post(route, {
                deviceInfo: await CapacitorDevice.getInfo(),
                username
            });

            if (response) {
                await this.storageService.set(StorageKey.requestId, response.requestId);
                await this.toastService.present(
                    "primary",
                    `This device has been added to the account.
                    Please verify the device in the Account page of an active device to continue.`
                );
                created = true;
            }
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

            await this.toastService.present("danger", errorMessage);
        }

        return created;
    }

    async delete(id: string) {
        AppComponent.showProgressBar = true;

        try {
            const response = await this.httpService.delete(`${route}/${id}`);

            if (response) {
                const user = this.usersService.user;
                remove(user.devices, (d) => d.id === id);
                this.usersService.setUser(user);
            }
        } catch (error) {
            console.error(error);
            await this.toastService.present("danger", "Unable to delete device");
        }

        AppComponent.showProgressBar = false;
    }

    async verify(id: string) {
        AppComponent.showProgressBar = true;

        try {
            const response = await this.httpService.patch(`${route}/${id}`, { isVerified: true });

            if (response) {
                const user = this.usersService.user;
                user.devices.find((d) => d.id === id).isVerified = true;
                this.usersService.setUser(user);
            }
        } catch (error) {
            console.error(error);
            await this.toastService.present("danger", "Unable to verify device");
        }

        AppComponent.showProgressBar = false;
    }

    private async setDeviceId() {
        const deviceId = (await CapacitorDevice.getId()).uuid;
        await this.storageService.set(StorageKey.deviceId, deviceId);
    }
}
