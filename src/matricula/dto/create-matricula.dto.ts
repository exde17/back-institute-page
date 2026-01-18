import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsBoolean, Min } from "class-validator";
import { TipoPago } from "../entities/matricula.entity";

export class CreateMatriculaDto {
  @IsString()
  @IsNotEmpty()
  estudianteId: string;

  @IsString()
  @IsOptional()
  documentoEstudiante?: string;

  @IsString()
  @IsOptional()
  diplomaCertificadoGrado10?: string;

  @IsString()
  @IsOptional()
  documentoAcudiente?: string;

  @IsString()
  @IsOptional()
  formularioMatricula?: string;

  @IsString()
  @IsNotEmpty()
  inscripcionId: string;

  @IsEnum(TipoPago)
  @IsOptional()
  tipoPago?: TipoPago;

  @IsString()
  @IsOptional()
  planPagoId?: string;

  @IsNumber()
  @Min(0)
  @IsOptional()
  valorTotal?: number;

  @IsBoolean()
  @IsOptional()
  esBecado?: boolean;

  @IsString()
  @IsOptional()
  entidadId?: string;
}
