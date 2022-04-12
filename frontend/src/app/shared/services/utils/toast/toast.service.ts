import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Injectable({
    providedIn: "root"
})
export class ToastService {
    toast: HTMLIonToastElement;

    constructor(public toastController: ToastController) {}

    async present(color: "danger" | "primary", message: string) {
        if (this.toast) {
            this.toast.dismiss();
        }

        this.toast = await this.toastController.create({
            color,
            message,
            buttons: [{ icon: "close", role: "cancel", cssClass: "toast-close-button" }],
            keyboardClose: true,
            position: "top"
        });

        this.toast.removeAttribute("tabindex");
        this.toast.present();
        return this.toast;
    }
}
