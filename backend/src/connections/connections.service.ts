import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ApiGatewayManagementApi } from "aws-sdk";
import { Repository } from "typeorm";
import { Connection } from "./entities/connection.entity";

@Injectable()
export class ConnectionsService {
    private apig: ApiGatewayManagementApi;

    constructor(
        @InjectRepository(Connection)
        private connectionsRepository: Repository<Connection>
    ) {
        this.apig = new ApiGatewayManagementApi({
            endpoint: process.env.APIG_URL
        });
    }

    async create(connectionId: string) {
        const connection = new Connection();
        connection.id = connectionId;
        await this.connectionsRepository.save(connection);
        await this.postToConnection(connectionId, { connectionId });
    }

    findOne(id: string) {
        return this.connectionsRepository.findOne(id);
    }

    delete(connectionId: string) {
        return this.connectionsRepository.delete(connectionId);
    }

    async message(connectionId: string, body: string) {
        const { action } = JSON.parse(body);

        switch (action) {
            case "ping":
                await this.postToConnection(connectionId, { action: "pong" });
                break;
        }
    }

    async postToConnection(connectionId: string, data: object) {
        await this.apig
            .postToConnection({
                ConnectionId: connectionId,
                Data: JSON.stringify(data)
            })
            .promise();
    }
}
