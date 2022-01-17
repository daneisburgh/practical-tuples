import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UpdateTupleDto } from "./dto/update-tuple.dto";
import { Tuple } from "./entities/tuple.entity";
import { User } from "../users/entities/user.entity";

@Injectable()
export class TuplesService {
    constructor(
        @InjectRepository(Tuple)
        private tuplesRepository: Repository<Tuple>
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
            relations: ["tupleItems"]
        });
    }

    remove(id: number) {
        return this.tuplesRepository.delete(id);
    }

    update(id: number, updateTupleDto: UpdateTupleDto) {
        return this.tuplesRepository.update(id, updateTupleDto);
    }
}
