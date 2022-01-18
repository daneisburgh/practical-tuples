import { Injectable } from "@angular/core";

import { User, UsersService } from "../users/users.service";
import { HttpService, RequestRoute } from "../../utils/http/http.service";
import { TupleItem } from "../tuple-items/tuple-items.service";

const route = RequestRoute.tuples;

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
    creator: User;
    users: User[];
    tupleItems: TupleItem[];
};

@Injectable({
    providedIn: "root"
})
export class TuplesService {
    constructor(private httpService: HttpService, private usersService: UsersService) {}

    async create() {
        const tuple = (await this.httpService.post(route, {})) as Tuple;
        this.usersService.user.tuples.unshift(tuple);
        return tuple;
    }

    async update(partialTuple: Partial<Tuple>) {
        const tuple = (await this.httpService.patch(route, partialTuple)) as Tuple;
        const tupleIndex = this.usersService.user.tuples.findIndex((t) => t.id === tuple.id);
        this.usersService.user.tuples[tupleIndex] = tuple;
    }
}
