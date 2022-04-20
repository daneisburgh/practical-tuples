import { Injectable, CanActivate, ExecutionContext, BadRequestException } from "@nestjs/common";

import { TuplesService } from "../tuples.service";
import { Tuple } from "../entities/tuple.entity";
import { TupleItem } from "../../tuple-items/entities/tuple-item.entity";

@Injectable()
export class TupleUserGuard implements CanActivate {
    constructor(private tuplesService: TuplesService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const {
            body: { tupleItems },
            params: { id },
            user
        } = context.switchToHttp().getRequest();

        const tuple = await this.tuplesService.findOne(+id);

        if (!tuple) {
            throw new BadRequestException("Invalid tuple");
        } else if (!user.tuples.find((t: Tuple) => t.id === tuple.id)) {
            throw new BadRequestException("Invalid tuple user");
        } else if (tupleItems && tupleItems.find((ti: TupleItem) => ti.tupleId !== tuple.id)) {
            throw new BadRequestException("Invalid tuple item");
        } else {
            return true;
        }
    }
}
