import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { cloneDeepWith, isObject, isString } from "lodash";
import { environment } from "src/environments/environment";
import { StorageService, StorageKey } from "../storage/storage.service";
import { WebSocketService } from "../websocket/websocket.service";

const { httpUrl } = environment;

enum RequestType {
    delete = "DELETE",
    patch = "PATCH",
    post = "POST"
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

    async delete(route: string) {
        return this.request(RequestType.delete, route);
    }

    async patch(route: string, body: any) {
        return this.request(RequestType.patch, route, body);
    }

    async post(route: string, body: any) {
        return this.request(RequestType.post, route, body);
    }

    async request(type: RequestType, route: string, body?: any) {
        let response;
        const headers = await this.getHeaders();

        switch (type) {
            case RequestType.delete:
                console.log("REQUEST", type, route);
                response = await this.httpClient.delete(httpUrl + route, headers).toPromise();
                break;

            case RequestType.patch:
                console.log("REQUEST", type, route, body);
                response = await this.httpClient.patch(httpUrl + route, body, headers).toPromise();
                break;

            case RequestType.post:
                console.log("REQUEST", type, route, body);
                response = await this.httpClient.post(httpUrl + route, body, headers).toPromise();
                break;
        }

        response = this.mapValuesDeep(response);

        console.log("RESPONSE", type, route, response);
        return response;
    }

    private async getHeaders() {
        const headers: any = {};
        const requestId = await this.storageService.get(StorageKey.requestId);

        if (requestId) {
            headers["request-id"] = requestId;
        }

        if (this.connectionId) {
            headers["connection-id"] = this.connectionId;
        }

        return { headers };
    }

    private mapValuesDeep(response: any) {
        return cloneDeepWith(response, (value) => {
            if (!isObject(value)) {
                if (isString(value) && !isNaN(Date.parse(value))) {
                    return new Date(value);
                } else {
                    return value;
                }
            }
        });
    }
}
