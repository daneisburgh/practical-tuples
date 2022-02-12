import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CreateTupleItemDto } from "./dto/create-tuple-item.dto";
import { UpdateTupleItemDto } from "./dto/update-tuple-item.dto";
import { TupleItem } from "./entities/tuple-item.entity";
import { TuplesService } from "../tuples/tuples.service";

@Injectable()
export class TupleItemsService {
    constructor(
        @InjectRepository(TupleItem)
        private tupleItemsRepository: Repository<TupleItem>,
        private tuplesService: TuplesService
    ) {}

    async create(createTupleItemDto: CreateTupleItemDto) {
        const tupleItem = Object.assign(new TupleItem(), createTupleItemDto);
        const { id, tupleId } = await this.tupleItemsRepository.save(tupleItem);
        await this.tuplesService.update(tupleId, {});
        return this.findOne(id);
    }

    findOne(id: number) {
        return this.tupleItemsRepository.findOneOrFail(id);
    }

    async update(id: number, updateTupleItemDto: UpdateTupleItemDto) {
        await this.tupleItemsRepository.update(id, updateTupleItemDto);
        const tupleItem = await this.findOne(id);
        await this.tuplesService.update(tupleItem.tupleId, {});
        return tupleItem;
    }

    async batchUpdate(tupleId: number, tupleItems: Partial<TupleItem>[]) {
        await this.tupleItemsRepository.save(tupleItems);
        await this.tuplesService.update(tupleId, {});
    }

    async delete(id: number) {
        const tupleItem = await this.findOne(id);
        await this.tupleItemsRepository.delete(id);
        await this.tuplesService.update(tupleItem.tupleId, {});
        return;
    }
}
