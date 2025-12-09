import { IsDate, IsDecimal, IsEnum, IsOptional, IsString } from "class-validator";
import { MetodoPago } from "../entities/pago.entity";
import { Inscripcion } from "src/inscripcion/entities/inscripcion.entity";
import { Matricula } from "src/matricula/entities/matricula.entity";

export class CreatePagoDto {
    @IsDecimal()
    @IsOptional()
    monto: number;

    @IsEnum(MetodoPago)
    @IsOptional()
    metodo: MetodoPago;

    @IsOptional()
    @IsString()
    referenciaPago: string;

    @IsOptional()
    @IsString()
    wompi_transaccion: string;

    @IsOptional()
    @IsDate()
    fechaPago: Date;

    @IsOptional()
    @IsString()
    raw_response: string;

    @IsString()
    matricula: Matricula;
}
