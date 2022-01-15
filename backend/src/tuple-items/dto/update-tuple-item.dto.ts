import { PartialType } from "@nestjs/mapped-types";
import { CreateTupleItemDto } from "./create-tuple-item.dto";

export class UpdateTupleItemDto extends PartialType(CreateTupleItemDto) {}
