import { IsString } from "class-validator";
import { User } from "src/user/entities/user.entity";

export class CreateMatriculaDto {
    @IsString()
    estudianteId: User;
}
