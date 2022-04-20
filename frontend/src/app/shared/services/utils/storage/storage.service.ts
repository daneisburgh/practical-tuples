import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";

export enum StorageKey {
    deviceId = "deviceId",
    requestId = "requestId",
    user = "user"
}

@Injectable({
    providedIn: "root"
})
export class StorageService {
    constructor(private storage: Storage) {
        this.storage.create();
    }

    async set(key: StorageKey, value: string) {
        await this.storage.set(key, value);
    }

    async get(key: StorageKey) {
        return await this.storage.get(key);
    }

    async remove(key: StorageKey) {
        await this.storage.remove(key);
    }
}
