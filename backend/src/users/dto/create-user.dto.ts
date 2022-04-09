import { DeviceInfo } from "@capacitor/device";
import { IsObject } from "class-validator";

export class CreateUserDto {
    @IsObject()
    deviceInfo: DeviceInfo;
}
