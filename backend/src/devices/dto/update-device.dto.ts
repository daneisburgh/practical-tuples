import { PartialType, PickType } from "@nestjs/mapped-types";

import { Device } from "../entities/device.entity";

export class UpdateDeviceDto extends PartialType(PickType(Device, ["isVerified"])) {}
