import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AES } from "crypto-js";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";

type FindConditions = {
    id?: number;
    connectionId?: string;
};

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) {}

    async create(connectionId: string) {
        const { id } = await this.usersRepository.save({ connectionId });
        const user = await this.findOne({ id });
        user.requestId = AES.encrypt(user.id.toString(), process.env.API_KEY).toString();
        return user;
    }

    async connect(id: number, connectionId: string) {
        await this.usersRepository.update(id, { connectionId });
        return this.findOne({ id });
    }

    findOne(conditions: FindConditions, select?: (keyof User)[]) {
        return this.usersRepository.findOne(conditions, {
            select,
            relations: ["connection", "tuples", "tuples.tupleItems"]
        });
    }

    delete(id: number) {
        return this.usersRepository.delete(id);
    }
}
