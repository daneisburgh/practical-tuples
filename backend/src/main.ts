import { INestApplication, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import serverlessExpress from "@vendia/serverless-express";
import { Callback, Context } from "aws-lambda";
import { SecretsManager } from "aws-sdk";
import helmet from "helmet";
import morgan from "morgan";
import fs from "fs";

import { AppModule } from "./app.module";
import { ConnectionsService } from "./connections/connections.service";

type WebSocketEvent = {
    requestContext: {
        connectionId: string;
        eventType: "CONNECT" | "DISCONNECT";
    };
};

let app: INestApplication;

const bootstrap = async () => {
    if (!fs.existsSync(".env")) {
        const secretsManager = new SecretsManager({ region: "us-east-1" });
        const { SecretString } = await secretsManager
            .getSecretValue({ SecretId: `practical-tuples-${process.env.NODE_ENV}` })
            .promise();

        await fs.promises.writeFile(".env", SecretString);
    }

    const app = await NestFactory.create(AppModule);

    app.use(helmet());
    app.use(morgan("tiny"));
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
            forbidUnknownValues: true
        })
    );

    return app;
};

export const handleHttpRequest = async (event: any, context: Context, callback: Callback) => {
    app = app ?? (await bootstrap());

    const serverlessExpressApp = (await app.init()).getHttpAdapter().getInstance();
    const server = serverlessExpress({ app: serverlessExpressApp });

    return server(event, context, callback);
};

export const handleWebSocketConnection = async (event: WebSocketEvent) => {
    app = app ?? (await bootstrap());

    const connectionsService = app.get(ConnectionsService);

    const {
        requestContext: { connectionId, eventType }
    } = event;

    switch (eventType) {
        case "CONNECT":
            await connectionsService.create(connectionId);
            break;
        case "DISCONNECT":
            await connectionsService.delete(connectionId);
            break;
    }
};
