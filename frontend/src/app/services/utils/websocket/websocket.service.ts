import { EventEmitter, Injectable } from "@angular/core";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

import { Device } from "../../resources/devices/devices.service";
import { Tuple } from "../../resources/tuples/tuples.service";
import { environment } from "../../../../environments/environment";
import { User } from "../../resources/users/users.service";

type ReceivedBody = {
    action: string;
    connectionId: string;
    device: {
        createDevice: Device;
        updateDevice: Device;
        deleteDevice: { id: string };
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
    tupleEvent = new EventEmitter<ReceivedBody["tuple"]>();
    userEvent = new EventEmitter<ReceivedBody["user"]>();
    connectionId?: string;

    private subject?: WebSocketSubject<any>;

    constructor() {
        this.connect();
    }

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
    }

    private async onClose() {
        console.log("DISCONNECTED");
        this.connectionId = undefined;
        this.connectionEvent.emit("disconnected");
    }

    private async receive(body: ReceivedBody) {
        console.log("RECEIVED", body);
        const { action, connectionId, device, message, tuple, user } = body;

        if (action) {
            switch (action) {
                case "pong":
                    this.pingPong();
                    break;
            }
        } else if (connectionId && message !== "Internal server error") {
            this.connectionId = connectionId;
            this.connectionEvent.emit("connectionId");
            this.pingPong();
        } else if (device) {
            this.deviceEvent.emit(device);
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
        console.log("SENT", body);
        this.subject.next(body);
    }
}
