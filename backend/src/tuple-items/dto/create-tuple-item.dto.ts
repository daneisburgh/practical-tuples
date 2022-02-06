import { PickType } from "@nestjs/mapped-types";
import { TupleItem } from "../entities/tuple-item.entity";

export class CreateTupleItemDto extends PickType(TupleItem, ["tupleId", "order"]) {}
