import { IsString } from "class-validator";
import { CreateUserDto } from "../../users/dto/create-user.dto";

export class CreateDeviceDto extends CreateUserDto {
    @IsString()
    username: string;
}
