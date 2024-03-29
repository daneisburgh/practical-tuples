import { EventEmitter, Injectable } from "@angular/core";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

import { Device } from "../../resources/devices/devices.service";
import { FriendRequest } from "../../resources/friend-requests/friend-requests.service";
import { Tuple } from "../../resources/tuples/tuples.service";
import { User } from "../../resources/users/users.service";
import { environment } from "../../../../environments/environment";

type ReceivedBody = {
    action: string;
    connectionId: string;
    device: {
        createDevice: Device;
        updateDevice: Device;
        deleteDevice: { id: string };
    };
    friendRequest: {
        createFriendRequest: FriendRequest;
        updateFriendRequest: FriendRequest;
        deleteFriendRequest: { id: string };
    };
    message: string;
    tuple: {
        createTuple: Tuple;
        updateTuple: Tuple;
        deleteTuple: { id: number };
    };
    user: {
        updateUser: User;
        deleteUser: { id: number };
    };
};

@Injectable({
    providedIn: "root"
})
export class WebSocketService {
    connectionEvent = new EventEmitter<"connected" | "connectionId" | "disconnected">();
    deviceEvent = new EventEmitter<ReceivedBody["device"]>();
    friendRequestEvent = new EventEmitter<ReceivedBody["friendRequest"]>();
    tupleEvent = new EventEmitter<ReceivedBody["tuple"]>();
    userEvent = new EventEmitter<ReceivedBody["user"]>();
    connectionId?: string;

    private subject?: WebSocketSubject<any>;

    constructor() {}

    connect() {
        console.log("CONNECTING");

        this.subject = webSocket({
            url: environment.websocketUrl,
            openObserver: { next: () => this.onOpen() },
            closeObserver: { next: () => this.onClose() }
        });

        this.subject.subscribe({
            next: (body) => this.receive(body),
            error: (error) => console.error(error)
        });
    }

    private onOpen() {
        console.log("CONNECTED");
        this.connectionEvent.emit("connected");
        this.send("connectionId");
    }

    private async onClose() {
        console.log("DISCONNECTED");
        this.connectionId = undefined;
        this.connectionEvent.emit("disconnected");
    }

    private async receive(body: ReceivedBody) {
        console.log("RECEIVE", body);
        const { action, connectionId, device, friendRequest, message, tuple, user } = body;

        if (action === "pong") {
            this.pingPong();
        } else if (connectionId && message !== "Internal server error") {
            this.connectionId = connectionId;
            this.connectionEvent.emit("connectionId");
            this.pingPong();
        } else if (device) {
            this.deviceEvent.emit(device);
        } else if (friendRequest) {
            this.friendRequestEvent.emit(friendRequest);
        } else if (tuple) {
            this.tupleEvent.emit(tuple);
        } else if (user) {
            this.userEvent.emit(user);
        }
    }

    private pingPong() {
        setTimeout(() => this.send("ping"), 60000);
    }

    private send(action: string) {
        const body = { action };
        console.log("SEND", body);
        this.subject.next(body);
    }
}
