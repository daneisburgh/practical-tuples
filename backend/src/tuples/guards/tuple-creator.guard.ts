import { Injectable, CanActivate, ExecutionContext, BadRequestException } from "@nestjs/common";

@Injectable()
export class TupleCreatorGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        console.log(request);

        return true;

        // if (!!user) {
        //     return true;
        // } else {
        //     throw new BadRequestException("Invalid connection");
        // }
    }
}
