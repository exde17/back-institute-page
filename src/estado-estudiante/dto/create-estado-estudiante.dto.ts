import { IsString } from "class-validator";

export class CreateEstadoEstudianteDto {
    @IsString()
    nombre: string;

    @IsString()
    descripcion?: string;
}