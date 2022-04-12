import { Injectable } from "@angular/core";

import { TupleItem } from "../tuple-items/tuple-items.service";
import { User, UsersService } from "../users/users.service";
import { HttpService } from "../../utils/http/http.service";

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
    constructor(private httpService: HttpService, private usersService: UsersService) {}

    async create() {
        return await this.httpService.post(route);
    }

    async update(id: number, tuple: Partial<Tuple>) {
        await this.httpService.patch(`${route}/${id}`, tuple);
    }

    async delete(id: number) {
        await this.httpService.delete(`${route}/${id}`);
    }
}
