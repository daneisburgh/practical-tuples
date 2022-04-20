import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { flatten } from "lodash";
import { Repository } from "typeorm";

import { UpdateTupleDto } from "./dto/update-tuple.dto";
import { Tuple } from "./entities/tuple.entity";
import { User } from "../users/entities/user.entity";
import { ConnectionsService } from "../connections/connections.service";
import { TupleItem } from "../tuple-items/entities/tuple-item.entity";

@Injectable()
export class TuplesService {
    constructor(
        @InjectRepository(Tuple)
        private tuplesRepository: Repository<Tuple>,
        @InjectRepository(TupleItem)
        private tupleItemsRepository: Repository<TupleItem>,
        private connectionsService: ConnectionsService
    ) {}

    async create(user: User, connectionId: string) {
        const { id } = await this.tuplesRepository.save({
            users: [user]
        });
        const tuple = await this.findOne(id);
        await this.notifyConnections(tuple, connectionId, { createTuple: tuple });
        return tuple;
    }

    async delete(id: number, connectionId: string) {
        const tuple = await this.findOne(id);
        await this.notifyConnections(tuple, connectionId, { deleteTuple: tuple });
        await this.tuplesRepository.delete(id);
    }

    findOne(id: number) {
        return this.tuplesRepository.findOne(id, {
            relations: ["tupleItems", "users", "users.devices", "users.devices.connection"]
        });
    }

    async update(id: number, updateTupleDto: UpdateTupleDto, connectionId: string) {
        const { tupleItems } = updateTupleDto;

        if (tupleItems) {
            await this.tupleItemsRepository.save(tupleItems);
            delete updateTupleDto.tupleItems;
        }

        await this.tuplesRepository.update(id, updateTupleDto);
        const tuple = await this.findOne(id);
        await this.notifyConnections(tuple, connectionId, { updateTuple: tuple });
        return tuple;
    }

    private async notifyConnections(tuple: Tuple, connectionId: string, data: object) {
        const connectionIds = flatten(
            tuple.users.map((user) =>
                user.devices
                    .filter((d) => d.connectionId !== connectionId && d.isVerified)
                    .map((device) => device.connectionId)
            )
        );

        for (const user of tuple.users) {
            delete user.devices;
        }

        for (const id of connectionIds) {
            await this.connectionsService.postToConnection(id, { tuple: data });
        }
    }
}
