import { IsNumber, IsString } from "class-validator";
import { Matricula } from "src/matricula/entities/matricula.entity";
import { Pago } from "src/pago/entities/pago.entity";

export class CreateFacturaDto {
    @IsString()
    matricula: Matricula;

    @IsNumber()
    valorTotal: number;

    @IsString()
    descripcion: string;

    @IsString()
    pago: Pago;
}
