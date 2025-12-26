import { IsNumber, IsString } from "class-validator";
import { Matricula } from "src/matricula/entities/matricula.entity";

export class CreatePlanPagoDto {
    @IsString()
    matricula: Matricula;

    @IsNumber()
    numeroCuotas: number;

    @IsNumber()
    valorCuota: number;

    @IsNumber()
    valorTotal: number;

    @IsString()
    descripcion: string;
}
