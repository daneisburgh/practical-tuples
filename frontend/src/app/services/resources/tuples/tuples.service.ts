import { Injectable } from "@angular/core";

import { User } from "../users/users.service";
import { HttpService, Route } from "../../utils/http/http.service";

const route = Route.tuples;
enum TupleType {
    list = "list",
    checkbox = "checkbox"
}

export type Tuple = {
    createdAt: Date;
    updatedAt: Date;
    id: number;
    name: string;
    type: TupleType;
    creator: User;
    users: User[];
    tupleItems: any[];
};

@Injectable({
    providedIn: "root"
})
export class TuplesService {
    constructor(private httpService: HttpService) {}

    async createTuple(name: string, type: TupleType) {
        const tuple = await this.httpService.post(route, { name, type });
    }
}
