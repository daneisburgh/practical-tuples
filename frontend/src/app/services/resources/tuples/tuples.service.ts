import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { merge, remove } from "lodash";

import { TupleItem } from "../tuple-items/tuple-items.service";
import { User, UsersService } from "../users/users.service";
import { HttpService } from "../../utils/http/http.service";
import { ToastService } from "../../utils/toast/toast.service";
import { WebSocketService } from "../../utils/websocket/websocket.service";

const route = "/tuples";

export enum TupleType {
    list = "List",
    checkbox = "Checkbox"
}

export type Tuple = {
    createdAt: Date;
    updatedAt: Date;
    id: number;
    name: string;
    type: TupleType;
    users: User[];
    tupleItems: TupleItem[];
};

@Injectable({
    providedIn: "root"
})
export class TuplesService {
    constructor(
        private httpService: HttpService,
        private router: Router,
        private toastService: ToastService,
        private usersService: UsersService,
        private webSocketService: WebSocketService
    ) {
        this.webSocketService.tupleEvent.subscribe(async (tupleEvent) => {
            const { createTuple, updateTuple, deleteTuple } = tupleEvent;
            const user = this.usersService.user
                ? Object.assign({}, this.usersService.user)
                : undefined;

            if (createTuple) {
                user.tuples.unshift(createTuple);
            } else if (deleteTuple) {
                remove(user.tuples, (t) => t.id === deleteTuple.id);
            } else if (updateTuple) {
                const currentTupleIndex = user.tuples.findIndex((t) => t.id === updateTuple.id);
                user.tuples[currentTupleIndex] = updateTuple;
            }

            await this.usersService.setUser(user);
            this.usersService.changeEvent.emit();
        });
    }

    async create() {
        try {
            const response = await this.httpService.post(route);

            if (response) {
                const user = this.usersService.user;
                user.tuples.unshift(response);
                await this.usersService.setUser(user);
                this.router.navigateByUrl("/tuple/" + response.id);
            }
        } catch (error) {
            console.error(error);
            await this.toastService.present("danger", "Unable to create a tuple");
        }
    }

    async update(id: number, tuple: Partial<Tuple>) {
        let updated = false;

        try {
            const response = await this.httpService.patch(`${route}/${id}`, tuple);

            if (response) {
                const user = this.usersService.user;
                merge(
                    user.tuples.find((t) => t.id === id),
                    tuple
                );
                await this.usersService.setUser(user);
                updated = true;
            }
        } catch (error) {
            console.error(error);
            await this.toastService.present("danger", "Unable to update tuple");
        }

        return updated;
    }

    async delete(id: number) {
        try {
            const response = await this.httpService.delete(`${route}/${id}`);

            if (response) {
                await this.router.navigateByUrl("/");
                const user = this.usersService.user;
                remove(user.tuples, (t) => t.id === id);
                await this.usersService.setUser(user);
            }
        } catch (error) {
            console.error(error);
            await this.toastService.present("danger", "Unable to delete tuple");
        }
    }

    async reorder(id: number, reorderedTupleItems: TupleItem[]) {
        let reordered = false;

        for (const [tupleItemIndex, tupleItem] of reorderedTupleItems.entries()) {
            tupleItem.order = tupleItemIndex;
            tupleItem.tupleId = id;
            delete tupleItem.createdAt;
            delete tupleItem.updatedAt;
        }

        try {
            const response = await this.update(id, { tupleItems: reorderedTupleItems });

            if (response) {
                const user = this.usersService.user;
                merge(
                    user.tuples.find((t) => t.id === id),
                    response
                );
                await this.usersService.setUser(user);
                reordered = true;
            }
        } catch (error) {
            console.error(error);
            await this.toastService.present("danger", "Unable to reorder tuple items");
        }

        return reordered;
    }
}
