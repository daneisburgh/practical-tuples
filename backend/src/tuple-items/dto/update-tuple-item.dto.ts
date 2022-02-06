import { PartialType, PickType } from "@nestjs/mapped-types";
import { TupleItem } from "../entities/tuple-item.entity";

export class UpdateTupleItemDto extends PartialType(PickType(TupleItem, ["isChecked", "value"])) {}
