import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { cloneDeepWith, isObject, isString } from "lodash";

import { StorageService, StorageKey } from "../storage/storage.service";
import { WebSocketService } from "../websocket/websocket.service";
import { environment } from "../../../../environments/environment";

const { httpUrl } = environment;
const logRequest = "REQUEST";
const logResponse = "RESPONSE";

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

    async patch(route: string, body?: any) {
        return this.request(RequestType.patch, route, body);
    }

    async post(route: string, body?: any) {
        return this.request(RequestType.post, route, body);
    }

    async request(type: RequestType, route: string, body?: any) {
        let response;
        const headers = await this.getHeaders();
        console.log(logRequest, type, route, body ? body : "");

        switch (type) {
            case RequestType.delete:
                response = await this.httpClient.delete(httpUrl + route, headers).toPromise();
                break;
            case RequestType.patch:
                response = await this.httpClient.patch(httpUrl + route, body, headers).toPromise();
                break;
            case RequestType.post:
                response = await this.httpClient.post(httpUrl + route, body, headers).toPromise();
                break;
        }

        response = this.mapDateValues(response);
        console.log(logResponse, type, route, response ? response : "");
        return response;
    }

    mapDateValues(object: any) {
        return cloneDeepWith(object, (value) => {
            if (!isObject(value)) {
                if (
                    isString(value) &&
                    !isNaN(Date.parse(value)) &&
                    new Date(value).getFullYear() >= 2022
                ) {
                    return new Date(value);
                } else {
                    return value;
                }
            }
        });
    }

    private async getHeaders() {
        const headers: any = {};
        const deviceId = await this.storageService.get(StorageKey.deviceId);
        const requestId = await this.storageService.get(StorageKey.requestId);

        if (deviceId) {
            headers["device-id"] = deviceId;
        }

        if (requestId) {
            headers["request-id"] = requestId;
        }

        if (this.connectionId) {
            headers["connection-id"] = this.connectionId;
        }

        return { headers };
    }
}
