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

    async create(createTupleItemDto: CreateTupleItemDto, connectionId: string) {
        const tupleItem = Object.assign(new TupleItem(), createTupleItemDto);
        const { id, tupleId } = await this.tupleItemsRepository.save(tupleItem);
        await this.tuplesService.update(tupleId, {}, connectionId);
        return this.findOne(id);
    }

    async delete(id: number, connectionId: string) {
        const tupleItem = await this.findOne(id);
        await this.tupleItemsRepository.delete(id);
        await this.tuplesService.update(tupleItem.tupleId, {}, connectionId);
    }

    findOne(id: number) {
        return this.tupleItemsRepository.findOne(id);
    }

    async update(id: number, updateTupleItemDto: UpdateTupleItemDto, connectionId: string) {
        await this.tupleItemsRepository.update(id, updateTupleItemDto);
        const tupleItem = await this.findOne(id);
        await this.tuplesService.update(tupleItem.tupleId, {}, connectionId);
        return tupleItem;
    }
}
