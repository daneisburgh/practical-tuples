import { Injectable } from "@nestjs/common";
import { CreateTupleItemDto } from "./dto/create-tuple-item.dto";
import { UpdateTupleItemDto } from "./dto/update-tuple-item.dto";

@Injectable()
export class TupleItemsService {
    create(createTupleItemDto: CreateTupleItemDto) {
        return "This action adds a new tupleItem";
    }

    findAll() {
        return `This action returns all tupleItems`;
    }

    findOne(id: number) {
        return `This action returns a #${id} tupleItem`;
    }

    update(id: number, updateTupleItemDto: UpdateTupleItemDto) {
        return `This action updates a #${id} tupleItem`;
    }

    remove(id: number) {
        return `This action removes a #${id} tupleItem`;
    }
}
