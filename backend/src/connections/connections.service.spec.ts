import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConnectionsService } from "./connections.service";
import { Connection } from "./entities/connection.entity";
import { User } from "../users/entities/user.entity";

describe("ConnectionsService", () => {
    let service: ConnectionsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ConnectionsService,
                {
                    provide: getRepositoryToken(Connection),
                    useClass: Repository
                },
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository
                }
            ]
        }).compile();

        service = module.get<ConnectionsService>(ConnectionsService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
