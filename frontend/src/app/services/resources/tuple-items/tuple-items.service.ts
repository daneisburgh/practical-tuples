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
        return (await this.httpService.post(route, { tupleId, order })) as TupleItem;
    }

    async update(id: number, tupleItem: Partial<TupleItem>) {
        return (await this.httpService.patch(`${route}/${id}`, tupleItem)) as TupleItem;
    }

    async batchUpdate(tupleId: number, tupleItems: Partial<TupleItem>[]) {
        return (await this.httpService.patch(`${route}`, { tupleId, tupleItems })) as TupleItem;
    }

    async delete(id: number) {
        await this.httpService.delete(`${route}/${id}`);
    }
}
