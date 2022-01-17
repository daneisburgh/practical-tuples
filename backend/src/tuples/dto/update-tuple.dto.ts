import { PartialType, PickType } from "@nestjs/mapped-types";
import { Tuple } from "../entities/tuple.entity";

export class UpdateTupleDto extends PartialType(PickType(Tuple, ["name", "type"])) {}
