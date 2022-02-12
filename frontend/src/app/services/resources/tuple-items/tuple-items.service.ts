import { Injectable } from "@angular/core";

import { HttpService } from "../../utils/http/http.service";
import { UsersService } from "../users/users.service";

const route = "/tuple-items";

export type TupleItem = {
    createdAt: Date;
    updatedAt: Date;
    id: number;
    isChecked: boolean;
    order: number;
    value: string;
};

@Injectable({
    providedIn: "root"
})
export class TupleItemsService {
    constructor(private httpService: HttpService, private usersService: UsersService) {}

    async create(tupleId: number, order: number) {
        await this.httpService.post(route, { tupleId, order });
    }

    async update(id: number, partialTupleItem: Partial<TupleItem>) {
        await this.httpService.patch(`${route}/${id}`, partialTupleItem);
    }

    async reorder(tupleId: number, tupleItems: Pick<TupleItem, "order">[]) {
        await this.batchUpdate(tupleId, tupleItems);
    }

    async delete(id: number) {
        await this.httpService.delete(`${route}/${id}`);
    }

    private async batchUpdate(tupleId: number, tupleItems: Partial<TupleItem>[]) {
        await this.httpService.patch(`${route}`, { tupleId, tupleItems });
    }
}
