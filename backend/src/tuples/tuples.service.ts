import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateTupleDto } from "./dto/create-tuple.dto";
import { UpdateTupleDto } from "./dto/update-tuple.dto";
import { Tuple } from "./entities/tuple.entity";
import { User } from "../users/entities/user.entity";

@Injectable()
export class TuplesService {
    constructor(
        @InjectRepository(Tuple)
        private tuplesRepository: Repository<Tuple>
    ) {}

    create(createTupleDto: CreateTupleDto, user: User) {
        const tuple = Object.assign(new Tuple(), createTupleDto);
        tuple.creator = user;
        tuple.users = [user];
        return this.tuplesRepository.save(tuple);
    }

    update(id: number, updateTupleDto: UpdateTupleDto) {
        return this.tuplesRepository.update(id, updateTupleDto);
    }

    remove(id: number) {
        return this.tuplesRepository.delete(id);
    }
}
