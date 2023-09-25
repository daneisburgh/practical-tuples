import { Injectable } from "@angular/core";
import { merge, remove } from "lodash";

import { TuplesService } from "../tuples/tuples.service";
import { UsersService } from "../users/users.service";
import { HttpService } from "../../utils/http/http.service";
import { ToastService } from "../../utils/toast/toast.service";

const route = "/tuple-items";

export type TupleItem = {
    createdAt: Date;
    updatedAt: Date;
    id: number;
    isChecked: boolean;
    order: number;
    name: string;
    tupleId?: number;
};

@Injectable({
    providedIn: "root"
})
export class TupleItemsService {
    constructor(
        private httpService: HttpService,
        private toastService: ToastService,
        private tupleService: TuplesService,
        private usersService: UsersService
    ) {}

    async create(tupleId: number, order: number) {
        try {
            const response = await this.httpService.post(route, { tupleId, order });

            if (response) {
                const user = this.usersService.user;
                const tupleItems = user.tuples.find((t) => t.id === tupleId).tupleItems;
                tupleItems.splice(order, 0, response);
                this.usersService.setUser(user);

                if (order < tupleItems.length - 1) {
                    await this.tupleService.reorder(tupleId, tupleItems);
                }
            }
        } catch (error) {
            console.error(error);
            await this.toastService.present("danger", "Unable to create tuple item");
        }
    }

    async delete(tupleId: number, id: number) {
        try {
            const response = await this.httpService.delete(`${route}/${id}`);

            if (response) {
                const user = this.usersService.user;
                remove(user.tuples.find((t) => t.id === tupleId).tupleItems, (ti) => ti.id === id);
                this.usersService.setUser(user);
            }
        } catch (error) {
            console.error(error);
            await this.toastService.present("danger", "Unable to delete tuple item");
        }
    }

    async update(tupleId: number, id: number, tupleItem: Partial<TupleItem>) {
        let updated = false;

        try {
            const response = await this.httpService.patch(`${route}/${id}`, tupleItem);

            if (response) {
                const user = this.usersService.user;
                merge(
                    user.tuples.find((t) => t.id === tupleId).tupleItems.find((ti) => ti.id === id),
                    tupleItem
                );
                this.usersService.setUser(user);
                updated = true;
            }
        } catch (error) {
            console.error(error);
            await this.toastService.present("danger", `Unable to update tuple item`);
        }

        return updated;
    }
}
