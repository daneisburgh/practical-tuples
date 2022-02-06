import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateTupleItemDto } from "./dto/create-tuple-item.dto";
import { UpdateTupleItemDto } from "./dto/update-tuple-item.dto";
import { TupleItem } from "./entities/tuple-item.entity";

@Injectable()
export class TupleItemsService {
    constructor(
        @InjectRepository(TupleItem)
        private tupleItemsRepository: Repository<TupleItem>
    ) {}

    async create(createTupleItemDto: CreateTupleItemDto) {
        const tupleItem = Object.assign(new TupleItem(), createTupleItemDto);
        const { id } = await this.tupleItemsRepository.save(tupleItem);
        return this.findOne(id);
    }

    findOne(id: number) {
        return this.tupleItemsRepository.findOneOrFail(id);
    }

    async update(id: number, updateTupleItemDto: UpdateTupleItemDto) {
        await this.tupleItemsRepository.update(id, updateTupleItemDto);
        return this.findOne(id);
    }

    async batchUpdate(tupleItems: Partial<TupleItem>[]) {
        await this.tupleItemsRepository.save(tupleItems);
    }

    async delete(id: number) {
        await this.tupleItemsRepository.delete(id);
        return;
    }
}
