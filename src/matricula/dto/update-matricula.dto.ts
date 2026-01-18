import { PartialType } from '@nestjs/mapped-types';
import { CreateMatriculaDto } from './create-matricula.dto';
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Transform } from 'class-transformer';
import { EstadoMatricula, TipoPago } from '../entities/matricula.entity';

export class UpdateMatriculaDto extends PartialType(CreateMatriculaDto) {
  @IsEnum(EstadoMatricula)
  @IsOptional()
  estadoMatricula?: EstadoMatricula;
}

export class UpdateTipoPagoDto {
  @IsEnum(TipoPago)
  tipoPago: TipoPago;

  @IsString()
  @IsOptional()
  planPagoId?: string;

  @Transform(({ value }) => value !== undefined && value !== '' ? parseFloat(value) : undefined)
  @IsNumber()
  @Min(0)
  valorTotal: number;
}

export class UpdateBecadoDto {
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  esBecado: boolean;

  @IsString()
  @IsOptional()
  entidadId?: string;
}

export class GenerarLinkPagoDto {
  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  cuotaId?: string;
}
