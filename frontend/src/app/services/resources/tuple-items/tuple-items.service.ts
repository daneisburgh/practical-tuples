import { Injectable } from "@angular/core";

import { HttpService, RequestRoute } from "../../utils/http/http.service";
import { Tuple } from "../tuples/tuples.service";
import { UsersService } from "../users/users.service";

const route = RequestRoute.tupleItems;

export type TupleItem = {
    createdAt: Date;
    updatedAt: Date;
    id: number;
    value: string;
};

@Injectable({
    providedIn: "root"
})
export class TupleItemsService {
    constructor(private httpService: HttpService, private usersService: UsersService) {}

    async create() {
        const tuple = (await this.httpService.post(route, {})) as Tuple;
        this.usersService.user.tuples.unshift(tuple);
        return tuple;
    }
}
