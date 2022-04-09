import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { flatten } from "lodash";
import { Repository } from "typeorm";

import { UpdateTupleDto } from "./dto/update-tuple.dto";
import { Tuple } from "./entities/tuple.entity";
import { User } from "../users/entities/user.entity";
import { ConnectionsService } from "../connections/connections.service";

@Injectable()
export class TuplesService {
    constructor(
        @InjectRepository(Tuple)
        private tuplesRepository: Repository<Tuple>,
        private connectionsService: ConnectionsService
    ) {}

    async create(user: User) {
        const { id } = await this.tuplesRepository.save({
            users: [user]
        });
        const tuple = await this.findOne(id);
        console.log(tuple);
        await this.notifyConnections(tuple, { createTuple: tuple });
        return tuple;
    }

    async delete(id: number) {
        const tuple = await this.findOne(id);
        await this.notifyConnections(tuple, { deleteTuple: tuple });
        await this.tuplesRepository.delete(id);
    }

    findOne(id: number) {
        return this.tuplesRepository.findOne(id, {
            relations: ["tupleItems", "users", "users.devices", "users.devices.connection"]
        });
    }

    async update(id: number, updateTupleDto: UpdateTupleDto) {
        await this.tuplesRepository.update(id, updateTupleDto);
        const tuple = await this.findOne(id);
        await this.notifyConnections(tuple, { updateTuple: tuple });
        return tuple;
    }

    private async notifyConnections(tuple: Tuple, data: object) {
        const connectionIds = flatten(
            tuple.users.map((user) => user.devices.map((device) => device.connectionId))
        );

        for (const user of tuple.users) {
            delete user.devices;
        }

        for (const connectionId of connectionIds) {
            await this.connectionsService.postToConnection(connectionId, { tuple: data });
        }
    }
}
