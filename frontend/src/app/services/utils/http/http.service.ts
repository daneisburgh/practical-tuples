import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { StorageService, StorageKey } from "../storage/storage.service";
import { WebSocketService } from "../websocket/websocket.service";

const { httpUrl } = environment;

export enum Route {
    users = "/users",
    tuples = "/tuples"
}

@Injectable({
    providedIn: "root"
})
export class HttpService {
    constructor(
        private httpClient: HttpClient,
        private storageService: StorageService,
        private webSocketService: WebSocketService
    ) {}

    get connectionId() {
        return this.webSocketService.connectionId;
    }

    async delete(route: Route): Promise<any> {
        const type = "DELETE";
        console.log("REQUEST", type, route);

        const headers = await this.getHeaders();
        const response = await this.httpClient.delete(httpUrl + route, headers).toPromise();

        console.log("RESPONSE", type, route, response);
        return response;
    }

    async patch(route: Route, body: any): Promise<any> {
        const type = "PATCH";
        console.log("REQUEST", type, route, body);

        const headers = await this.getHeaders();
        const response = await this.httpClient.patch(httpUrl + route, body, headers).toPromise();

        console.log("RESPONSE", type, route, response);
        return response;
    }

    async post(route: Route, body: any): Promise<any> {
        const type = "POST";
        console.log("REQUEST", type, route, body);

        const headers = await this.getHeaders();
        const response = await this.httpClient.post(httpUrl + route, body, headers).toPromise();

        console.log("RESPONSE", type, route, response);
        return response;
    }

    private async getHeaders() {
        const headers: any = {};
        const requestId = await this.storageService.get(StorageKey.requestId);

        if (this.connectionId) {
            headers["connection-id"] = this.connectionId;
        }

        if (requestId) {
            headers["request-id"] = requestId;
        }

        return { headers };
    }
}
