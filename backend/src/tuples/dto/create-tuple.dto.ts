import { PickType } from "@nestjs/mapped-types";
import { Tuple } from "../entities/tuple.entity";

export class CreateTupleDto extends PickType(Tuple, ["name", "type"]) {}
