import { Injectable, CanActivate, ExecutionContext, BadRequestException } from "@nestjs/common";

import { TuplesService } from "../tuples.service";

@Injectable()
export class TupleCreatorGuard implements CanActivate {
    constructor(private tuplesService: TuplesService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const {
            params: { id },
            user
        } = context.switchToHttp().getRequest();

        const tuple = await this.tuplesService.findOne(+id);

        if (!tuple) {
            throw new BadRequestException("Invalid tuple");
        } else if (tuple.creator.id !== user.id) {
            throw new BadRequestException("Invalid tuple creator");
        } else {
            return true;
        }
    }
}
