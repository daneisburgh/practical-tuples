import { PartialType } from "@nestjs/mapped-types";
import { CreateTupleDto } from "./create-tuple.dto";

export class UpdateTupleDto extends PartialType(CreateTupleDto) {}
