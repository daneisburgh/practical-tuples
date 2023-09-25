import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { cloneDeepWith, isObject, isString } from "lodash";

import { StorageService, StorageKey } from "../storage/storage.service";
import { ToastService } from "../toast/toast.service";
import { WebSocketService } from "../websocket/websocket.service";
import { environment } from "../../../../environments/environment";
import { AppComponent } from "../../../app.component";

const { httpUrl } = environment;
const logRequest = "REQUEST";
const logResponse = "RESPONSE";

enum RequestType {
    delete = "delete",
    patch = "update",
    post = "create"
}

@Injectable({
    providedIn: "root"
})
export class HttpService {
    constructor(
        private httpClient: HttpClient,
        private storageService: StorageService,
        private toastService: ToastService,
        private webSocketService: WebSocketService
    ) {}

    get connectionId() {
        return this.webSocketService.connectionId;
    }

    async delete(route: string, doNotShowProgressBar?: boolean) {
        return this.request(RequestType.delete, route, doNotShowProgressBar);
    }

    async patch(route: string, body?: any, doNotShowProgressBar?: boolean) {
        return this.request(RequestType.patch, route, body, doNotShowProgressBar);
    }

    async post(route: string, body?: any, doNotShowProgressBar?: boolean) {
        return this.request(RequestType.post, route, body, doNotShowProgressBar);
    }

    async request(type: RequestType, route: string, body?: any, doNotShowProgressBar?: boolean) {
        if (AppComponent.connectionStatus === "Connected" || route === "/users/connect") {
            AppComponent.showProgressBar = AppComponent.showProgressBar || !doNotShowProgressBar;
            let response;
            const url = httpUrl + route;
            const headers = await this.getHeaders();
            console.log(logRequest, type.toUpperCase(), route, body ? body : "");

            try {
                switch (type) {
                    case RequestType.delete:
                        response = await this.httpClient.delete(url, headers).toPromise();
                        break;
                    case RequestType.patch:
                        response = await this.httpClient.patch(url, body, headers).toPromise();
                        break;
                    case RequestType.post:
                        response = await this.httpClient.post(url, body, headers).toPromise();
                        break;
                }
            } catch (error) {
                AppComponent.showProgressBar =
                    AppComponent.connectionStatus !== "Connected" && !doNotShowProgressBar;
                throw error;
            }

            response = this.mapDateValues(response);
            console.log(logResponse, type.toUpperCase(), route, response ? response : "");
            AppComponent.showProgressBar =
                AppComponent.connectionStatus !== "Connected" && !doNotShowProgressBar;
            return response;
        }
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
