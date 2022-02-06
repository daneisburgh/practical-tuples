import { EventEmitter, Injectable } from "@angular/core";

import { Tuple } from "../tuples/tuples.service";
import { HttpService } from "../../utils/http/http.service";
import { StorageKey, StorageService } from "../../utils/storage/storage.service";
import { WebSocketService } from "../../utils/websocket/websocket.service";
import { orderBy } from "lodash";

const route = "/users";

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
            let user: User;
            const body = { connectionId: this.webSocketService.connectionId };
            const requestId = await this.storageService.get(StorageKey.requestId);

            if (!requestId) {
                user = await this.httpService.post(route, body);
                await this.storageService.set(
                    StorageKey.requestId,
                    user?.requestId.toString() as string
                );
            } else {
                user = await this.httpService.patch(route, body);
            }

            user.tuples = orderBy(user.tuples, "updatedAt", "desc");

            for (const tuple of user.tuples) {
                tuple.tupleItems = orderBy(tuple.tupleItems, "order", "asc");
            }

            this.user = user as User;
        } catch (error: any) {
            console.error(error);
        } finally {
            this.connectionEvent.emit();
        }
    }
}
