import { Injectable, CanActivate, ExecutionContext, BadRequestException } from "@nestjs/common";

import { TupleItemsService } from "../tuple-items.service";

@Injectable()
export class TupleItemUserGuard implements CanActivate {
    constructor(private tupleItemsService: TupleItemsService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const {
            params: { id },
            user
        } = context.switchToHttp().getRequest();

        const tupleItem = await this.tupleItemsService.findOne(+id);

        if (!tupleItem) {
            throw new BadRequestException("Invalid tuple item");
        } else if (!user.tuples.find((t) => t.id === tupleItem.tupleId)) {
            throw new BadRequestException("Invalid tuple item user");
        } else {
            return true;
        }
    }
}
