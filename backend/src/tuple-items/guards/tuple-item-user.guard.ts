import { Injectable, CanActivate, ExecutionContext, BadRequestException } from "@nestjs/common";

import { TupleItemsService } from "../tuple-items.service";
import { TuplesService } from "../../tuples/tuples.service";

@Injectable()
export class TupleItemUserGuard implements CanActivate {
    constructor(
        private tupleItemsService: TupleItemsService,
        private tuplesService: TuplesService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const {
            params: { id },
            user
        } = context.switchToHttp().getRequest();

        const { tupleId } = await this.tupleItemsService.findOne(+id);
        const tuple = await this.tuplesService.findOne(tupleId);

        if (!tuple) {
            throw new BadRequestException("Invalid tuple");
        } else if (!tuple.users.map((u) => u.id).includes(user.id)) {
            throw new BadRequestException("Invalid tuple user");
        } else {
            return true;
        }
    }
}
