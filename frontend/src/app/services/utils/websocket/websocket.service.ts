import { EventEmitter, Injectable } from "@angular/core";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

import { environment } from "src/environments/environment";

type Message = {
    connectionId: string;
};

@Injectable({
    providedIn: "root"
})
export class WebSocketService {
    connectionEvent = new EventEmitter<"connected" | "connectionId" | "disconnected">();
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
            next: (message) => this.handleMessage(message),
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

    private async handleMessage(message: Message) {
        console.log("MESSAGE", message);
        const { connectionId } = message;

        if (connectionId) {
            this.connectionId = connectionId;
            this.connectionEvent.emit("connectionId");
        }
    }
}
