import { IsDate, IsDecimal, IsEnum, IsOptional, IsString } from "class-validator";
import { MetodoPago } from "../entities/pago.entity";
import { Inscripcion } from "src/inscripcion/entities/inscripcion.entity";

export class CreatePagoDto {
    @IsDecimal()
    monto: number;

    @IsEnum(MetodoPago)
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
    inscripcion: Inscripcion;
}
