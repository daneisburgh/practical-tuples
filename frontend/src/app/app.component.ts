import { Component, HostListener, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { NavigationStart, Router } from "@angular/router";
import { Platform } from "@ionic/angular";

import { UsersService } from "./shared/services/resources/users/users.service";
import { ToastService } from "./shared/services/utils/toast/toast.service";
import { WebSocketService } from "./shared/services/utils/websocket/websocket.service";

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
    static isCreatingAccount = false;
    static platformWidth = 0;
    static showProgressBar = false;
    static readonly smallScreenWidth = 480;

    isConnecting = false;
    isLoading = true;
    isReady = false;
    routeUrl = "/";
    routeUrlPrevious = this.routeUrl;
    routes: RouteInfo[] = [
        { url: "/", label: "Home", icon: "home" },
        { url: "/account", label: "Account", icon: "person" }
    ];
    unableToConnectToast: HTMLIonToastElement;

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

    get displayMenu() {
        return this.user && this.isSmallScreen && !this.isCreatingAccount;
    }

    get displayMenuBadge() {
        return (
            this.displayMenu && this.routes.filter((route) => this.displayBadge(route)).length > 0
        );
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

        this.router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.routeUrl = event.url;

                if (!this.isLoading) {
                    this.setRouteTitle();
                }
            }
        });

        this.usersService.connectionEvent.subscribe(() => {
            if (!this.user && this.routeUrl !== "/" && !this.routeUrl.includes("error")) {
                const code =
                    this.routeUrl === "/account" || this.routeUrl.startsWith("/tuple") ? 401 : 404;
                this.router.navigate(["/error"], {
                    skipLocationChange: true,
                    queryParams: { code }
                });
            }

            this.isConnecting = false;
            this.isReady = true;
            this.removeLoadingElement();
        });

        this.webSocketService.connectionEvent.subscribe(async (event) => {
            if (event === "disconnected") {
                if (!this.isLoading && this.isConnecting) {
                    this.unableToConnectToast = await this.toastService.present(
                        "danger",
                        "Unable to connect"
                    );
                }

                this.isConnecting = false;
                this.isReady = false;
                this.removeLoadingElement();
            }
        });
    }

    async connect() {
        if (this.unableToConnectToast) {
            this.unableToConnectToast.dismiss();
        }

        AppComponent.showProgressBar = true;
        this.isConnecting = true;
        this.isReady = false;
        this.webSocketService.connect();
    }

    displayBadge(route: RouteInfo) {
        if (route.url === "/account") {
            return !!this.user.devices.find((device) => !device.isVerified);
        }
    }

    isRouteActive(route: string) {
        return route === this.routeUrl;
    }

    private removeLoadingElement() {
        if (!this.isLoading) {
            this.setRouteTitle();
        }

        this.isLoading = false;
    }

    private setRouteTitle() {
        let routeTitle: string;

        if (this.routeUrl === "/account") {
            routeTitle = "Account";
        }

        this.title.setTitle("Practical Tuples" + (routeTitle ? ` | ${routeTitle}` : ""));
        AppComponent.showProgressBar = false;
    }
}
