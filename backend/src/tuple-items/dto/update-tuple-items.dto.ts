import { IntersectionType, PartialType, PickType } from "@nestjs/mapped-types";
import { TupleItem } from "../entities/tuple-item.entity";

class UpdateTupleItem extends IntersectionType(
    PickType(TupleItem, ["id"]),
    PartialType(PickType(TupleItem, ["isChecked", "order"]))
) {}

export type UpdateTupleItemsDto = {
    tupleId: number;
    tupleItems: UpdateTupleItem[];
};
