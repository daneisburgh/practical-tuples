import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AlertController } from "@ionic/angular";

import { Tuple, TuplesService, TupleType } from "../../services/resources/tuples/tuples.service";
import { UsersService } from "../../services/resources/users/users.service";

@Component({
    selector: "app-home",
    templateUrl: "home.page.html",
    styleUrls: ["home.page.scss"]
})
export class HomePage {
    deletingTupleId = -1;
    isCreatingTuple = false;

    constructor(
        private alertController: AlertController,
        private router: Router,
        private tuplesService: TuplesService,
        private usersService: UsersService
    ) {}

    get user() {
        return this.usersService.user;
    }

    get isInputDisabled() {
        return this.deletingTupleId > -1 || this.isCreatingTuple;
    }

    async createTuple() {
        this.isCreatingTuple = true;
        const { id } = await this.tuplesService.create();
        this.router.navigateByUrl("/tuple/" + id);
        this.isCreatingTuple = false;
    }

    async deleteTuple(tuple: Tuple) {
        const alert = await this.alertController.create({
            message: "Please confirm tuple deletion. This action is irreversible.",
            buttons: [
                {
                    text: "Delete",
                    cssClass: "alert-button-danger",
                    handler: async () => {
                        this.deletingTupleId = tuple.id;
                        await this.tuplesService.delete(tuple.id);
                        this.router.navigateByUrl("/");
                        this.deletingTupleId = -1;
                    }
                },
                {
                    text: "Cancel",
                    role: "cancel"
                }
            ]
        });

        await alert.present();
    }

    getTupleItemsString(tuple: Tuple) {
        const { tupleItems, type } = tuple;
        const tupleItemsLengthString = tupleItems.length.toString();
        let tupleItemsString = tupleItemsLengthString;

        if (tupleItems.length > 0 && type === TupleType.checkbox) {
            const checked = tupleItems.filter((tupleItem) => tupleItem.isChecked).length;
            tupleItemsString += ` (${checked}/${tupleItemsLengthString} checked)`;
        }

        return tupleItemsString;
    }
}
