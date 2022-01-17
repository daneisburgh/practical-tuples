import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { NavigationStart, Router } from "@angular/router";

import { User, UsersService } from "./services/resources/users/users.service";
import { WebSocketService } from "./services/utils/websocket/websocket.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
    @ViewChild("closeConfirmLogOutModal") closeConfirmLogOutModal?: ElementRef;
    @ViewChild("navbarToggler") navbarToggler?: ElementRef;

    readonly currentYear = new Date().getFullYear();

    connecting = false;
    connected = false;
    connectingErrorMessage = false;
    loading = true;

    private routeUrl = "/";

    constructor(
        private router: Router,
        private title: Title,
        private usersService: UsersService,
        private webSocketService: WebSocketService
    ) {}

    get user() {
        return this.usersService.user as User;
    }

    ngOnInit() {
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.routeUrl = event.url;

                if (!this.loading) {
                    this.setRouteTitle();
                }
            }
        });

        this.usersService.connectionEvent.subscribe(() => {
            this.removeLoadingElement();
            this.connected = !!this.user;

            if (!this.connected && this.connecting) {
                this.updateConnectingStatus();
            }
        });

        this.webSocketService.connectionEvent.subscribe(async (event) => {
            switch (event) {
                case "disconnected":
                    this.removeLoadingElement();
                    this.connected = false;

                    if (this.connecting) {
                        this.updateConnectingStatus();
                    }

                    break;
            }
        });
    }

    connect() {
        this.connecting = true;
        this.connectingErrorMessage = false;
        this.webSocketService.connect();
    }

    isRouteActive(route: string) {
        return route === this.routeUrl;
    }

    private removeLoadingElement() {
        if (this.loading) {
            this.setRouteTitle();
            this.loading = false;
        }
    }

    private setRouteTitle() {
        let routeTitle;

        if (this.routeUrl === "/settings") {
            routeTitle = "Settings";
        }

        this.title.setTitle("Practical Tuples" + (routeTitle ? ` | ${routeTitle}` : ""));
    }

    private updateConnectingStatus() {
        this.connecting = false;
        this.connectingErrorMessage = true;
    }
}
