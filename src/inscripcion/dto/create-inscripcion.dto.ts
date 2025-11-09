import { IsString } from "class-validator";
import { Programa } from "src/programas/entities/programa.entity";
import { User } from "src/user/entities/user.entity";

export class CreateInscripcionDto {
    @IsString()
    observacion: string;

    @IsString()
    programa: Programa;

    @IsString()
    user: User;

}
