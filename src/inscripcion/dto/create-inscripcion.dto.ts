import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateInscripcionDto {
    @IsString()
    @IsOptional()
    observacion: string;

    @IsUUID()
    programa: string;

}
