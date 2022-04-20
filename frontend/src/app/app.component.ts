import { Component, HostListener, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { NavigationStart, Router } from "@angular/router";
import { Platform } from "@ionic/angular";

import { UsersService } from "./services/resources/users/users.service";
import { ToastService } from "./services/utils/toast/toast.service";
import { WebSocketService } from "./services/utils/websocket/websocket.service";

type RouteInfo = {
    url: string;
    label: string;
    icon: string;
};

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
    static connectionStatus: "Connecting" | "Connected" | "Disconnected" = "Connecting";
    static isCreatingAccount = false;
    static platformWidth = 0;
    static showProgressBar = false;
    static unableToConnectToast: HTMLIonToastElement;
    static readonly smallScreenWidth = 480;

    readonly currentYear = new Date().getFullYear();

    routeUrl = "/";
    routeUrlPrevious = this.routeUrl;
    routes: RouteInfo[] = [
        { url: "/", label: "Home", icon: "home" },
        { url: "/account", label: "Account", icon: "person" }
    ];

    constructor(
        private platform: Platform,
        private router: Router,
        private title: Title,
        private toastService: ToastService,
        private usersService: UsersService,
        private webSocketService: WebSocketService
    ) {}

    static get isSmallScreen() {
        return this.platformWidth < this.smallScreenWidth;
    }

    get connectionStatus() {
        return AppComponent.connectionStatus;
    }

    get connectionStatusColor() {
        switch (this.connectionStatus) {
            case "Connecting":
                return "dark";
            case "Connected":
                return "success";
            case "Disconnected":
                return "danger";
        }
    }

    get displayMenu() {
        return this.user && this.isSmallScreen && !this.isCreatingAccount;
    }

    get displayMenuBadge() {
        return (
            this.displayMenu && this.routes.filter((route) => this.displayBadge(route)).length > 0
        );
    }

    get isConnecting() {
        return AppComponent.connectionStatus === "Connecting";
    }

    get isCreatingAccount() {
        return AppComponent.isCreatingAccount;
    }

    get isSmallScreen() {
        return AppComponent.isSmallScreen;
    }

    get showProgressBar() {
        return AppComponent.showProgressBar;
    }

    get user() {
        return this.usersService.user;
    }

    static getDateString(date: Date) {
        const dateString = date.toLocaleDateString();
        const timeString = date.toLocaleTimeString().replace(/(.*)\D\d+/, "$1");
        return `${dateString} ${timeString}`;
    }

    @HostListener("window:resize")
    resizeEvent() {
        AppComponent.platformWidth = this.platform.width();
    }

    ngOnInit() {
        this.resizeEvent();
        this.webSocketService.connect();

        this.router.events.subscribe(async (event) => {
            if (event instanceof NavigationStart) {
                if (!this.user) {
                    await this.usersService.setUser();
                }

                this.routeUrl = event.url;
                this.setRouteTitle();
            }
        });

        this.usersService.connectionEvent.subscribe(() => {
            AppComponent.connectionStatus = "Connected";
            AppComponent.showProgressBar = false;
        });

        this.webSocketService.connectionEvent.subscribe(async (event) => {
            if (event === "disconnected") {
                switch (AppComponent.connectionStatus) {
                    case "Connecting":
                        AppComponent.showProgressBar = false;
                        AppComponent.unableToConnectToast = await this.toastService.present(
                            "danger",
                            "Unable to connect"
                        );
                        break;
                    case "Connected":
                        AppComponent.unableToConnectToast = await this.toastService.present(
                            "danger",
                            "You have lost connection. Please reconnect to continue."
                        );
                        break;
                }

                AppComponent.connectionStatus = "Disconnected";
            }
        });
    }

    async connect() {
        this.webSocketService.connect();
        AppComponent.connectionStatus = "Connecting";
        AppComponent.showProgressBar = true;

        if (AppComponent.unableToConnectToast) {
            AppComponent.unableToConnectToast.dismiss();
        }
    }

    displayBadge(route: RouteInfo) {
        if (route.url === "/account") {
            return !!this.user.devices.find((device) => !device.isVerified);
        }
    }

    isRouteActive(route: string) {
        return route === this.routeUrl;
    }

    private setRouteTitle() {
        if (!this.user && this.routeUrl !== "/" && !this.routeUrl.includes("error")) {
            const code =
                this.routeUrl === "/account" || this.routeUrl.startsWith("/tuple") ? 401 : 404;
            this.router.navigate(["/error"], {
                skipLocationChange: true,
                queryParams: { code }
            });
        } else {
            let routeTitle: string;

            if (this.routeUrl === "/account") {
                routeTitle = "Account";
            }

            this.title.setTitle("Practical Tuples" + (routeTitle ? ` | ${routeTitle}` : ""));
            AppComponent.showProgressBar = false;
        }
    }
}
