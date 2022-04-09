import { Test, TestingModule } from "@nestjs/testing";

import { DevicesService } from "./devices.service";
import { ConnectionsService } from "../connections/connections.service";

describe("DevicesService", () => {
    let service: DevicesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [ConnectionsService, DevicesService]
        }).compile();

        service = module.get<DevicesService>(DevicesService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
