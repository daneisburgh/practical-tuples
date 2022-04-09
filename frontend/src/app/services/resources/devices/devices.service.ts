import { Injectable } from "@angular/core";
import { Device, DeviceInfo } from "@capacitor/device";

import { HttpService } from "../../utils/http/http.service";
import { StorageKey, StorageService } from "../../utils/storage/storage.service";

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
    deviceInfo: DeviceInfo;

    constructor(private httpService: HttpService, private storageService: StorageService) {
        this.setDeviceInfo();
    }

    async create(username: string) {
        const { requestId } = await this.httpService.post(route, {
            deviceInfo: this.deviceInfo,
            username
        });
        await this.storageService.set(StorageKey.requestId, requestId);
    }

    async delete(id: string) {
        await this.httpService.delete(`${route}/${id}`);
    }

    async update(id: string, device: Partial<Device>) {
        await this.httpService.patch(`${route}/${id}`, device);
    }

    private async setDeviceInfo() {
        const deviceId = (await Device.getId()).uuid;
        await this.storageService.set(StorageKey.deviceId, deviceId);
        this.deviceInfo = await Device.getInfo();
    }
}
