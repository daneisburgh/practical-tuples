import { EventEmitter, Injectable } from "@angular/core";

import { Tuple } from "../tuples/tuples.service";
import { HttpService, Route } from "../../utils/http/http.service";
import { StorageKey, StorageService } from "../../utils/storage/storage.service";
import { WebSocketService } from "../../utils/websocket/websocket.service";

export type User = {
    createdAt: Date;
    updatedAt: Date;
    id: number;
    requestId: string;
    isOnline: boolean;
    tuples: Tuple[];
};

@Injectable({
    providedIn: "root"
})
export class UsersService {
    connectionEvent = new EventEmitter<void>();
    user?: User;

    constructor(
        private httpService: HttpService,
        private storageService: StorageService,
        private webSocketService: WebSocketService
    ) {
        this.webSocketService.connectionEvent.subscribe(async (event) => {
            switch (event) {
                case "connectionId":
                    this.connect();
                    break;
                case "disconnected":
                    this.user = undefined;
                    break;
            }
        });
    }

    private async connect() {
        try {
            const body = { connectionId: this.webSocketService.connectionId };
            const requestId = await this.storageService.get(StorageKey.requestId);

            if (!requestId) {
                this.user = (await this.httpService.post(Route.users, body)) as User;
                await this.storageService.set(
                    StorageKey.requestId,
                    this.user?.requestId.toString() as string
                );
            } else {
                this.user = (await this.httpService.patch(Route.users, body)) as User;
                // this.user.tuples = new Array(50);
            }
        } catch (error: any) {
            console.error(error);
        } finally {
            this.connectionEvent.emit();
        }
    }
}
