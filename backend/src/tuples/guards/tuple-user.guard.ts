import { Injectable, CanActivate, ExecutionContext, BadRequestException } from "@nestjs/common";

import { TuplesService } from "../tuples.service";

@Injectable()
export class TupleUserGuard implements CanActivate {
    constructor(private tuplesService: TuplesService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const {
            params: { id },
            user
        } = context.switchToHttp().getRequest();

        const tuple = await this.tuplesService.findOne(+id);

        if (!tuple) {
            throw new BadRequestException("Invalid tuple");
        } else if (!user.tuples.find((t) => t.id === tuple.id)) {
            throw new BadRequestException("Invalid tuple user");
        } else {
            return true;
        }
    }
}
