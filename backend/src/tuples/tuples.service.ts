import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UpdateTupleDto } from "./dto/update-tuple.dto";
import { Tuple } from "./entities/tuple.entity";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { ConnectionsService } from "../connections/connections.service";

@Injectable()
export class TuplesService {
    constructor(
        @InjectRepository(Tuple)
        private tuplesRepository: Repository<Tuple>,
        private connectionsService: ConnectionsService,
        private usersService: UsersService
    ) {}

    async create(user: User) {
        const tuple = new Tuple();
        tuple.creator = user;
        tuple.users = [user];
        const { id } = await this.tuplesRepository.save(tuple);
        return this.findOne(id);
    }

    findOne(id: number) {
        return this.tuplesRepository.findOneOrFail(id, {
            relations: ["creator", "tupleItems", "users"]
        });
    }

    async update(id: number, updateTupleDto: UpdateTupleDto) {
        await this.tuplesRepository.update(id, updateTupleDto);
        const tuple = await this.findOne(id);

        for (const user of tuple.users) {
            const { connection } = await this.usersService.findOne({ id: user.id });
            await this.connectionsService.postToConnection(connection.id, { tuple });
        }

        return tuple;
    }

    async delete(id: number) {
        await this.tuplesRepository.delete(id);
        return;
    }
}
