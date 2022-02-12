import { EventEmitter, Injectable } from "@angular/core";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

import { Tuple } from "../../resources/tuples/tuples.service";
import { environment } from "../../../../environments/environment";

type Message = {
    action: string;
    connectionId: string;
    tuple: Tuple;
};

@Injectable({
    providedIn: "root"
})
export class WebSocketService {
    connectionEvent = new EventEmitter<"connected" | "connectionId" | "disconnected">();
    tupleEvent = new EventEmitter<Tuple>();
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
            next: (message) => this.receive(message),
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

    private async receive(message: Message) {
        console.log("RECEIVE", message);
        const { action, connectionId, tuple } = message;

        if (action) {
            switch (action) {
                case "pong":
                    this.pingPong();
                    break;
            }
        } else if (connectionId) {
            this.connectionId = connectionId;
            this.connectionEvent.emit("connectionId");
            this.pingPong();
        } else if (tuple) {
            this.tupleEvent.emit(tuple);
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
