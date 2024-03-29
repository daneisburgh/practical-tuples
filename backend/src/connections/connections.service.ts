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
        this.apig = new ApiGatewayManagementApi({ endpoint: process.env.APIG_URL });
    }

    async create(id: string) {
        const connection = Object.assign(new Connection(), { id });
        await this.connectionsRepository.save(connection);
    }

    async delete(id: string) {
        const connection = await this.findOne(id);

        if (connection) {
            await this.connectionsRepository.delete(connection.id);
        }
    }

    findOne(id: string) {
        return this.connectionsRepository.findOne(id, { relations: ["device"] });
    }

    async message(id: string, body: string) {
        const { action } = JSON.parse(body);

        switch (action) {
            case "connectionId":
                await this.postToConnection(id, { connectionId: id });
                break;
            case "ping":
                await this.postToConnection(id, { action: "pong" });
                break;
        }
    }

    async postToConnection(id: string, data: object) {
        try {
            if (id) {
                await this.apig
                    .postToConnection({ ConnectionId: id, Data: JSON.stringify(data) })
                    .promise();
            }
        } catch (error) {
            console.error(error);
            await this.delete(id);
        }
    }
}
