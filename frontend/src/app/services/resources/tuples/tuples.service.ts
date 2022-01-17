import { Injectable } from "@angular/core";

import { User, UsersService } from "../users/users.service";
import { HttpService, RequestRoute } from "../../utils/http/http.service";

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

export type TupleItem = {
    createdAt: Date;
    updatedAt: Date;
    id: number;
    value: string;
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
}
