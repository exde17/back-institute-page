import { IsString } from "class-validator";

export class CreateCategoriaEstudianteDto {
    @IsString()
    nombre: string;

    @IsString()
    descripcion: string;    

}
