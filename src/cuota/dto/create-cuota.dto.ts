import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, IsDateString, IsEnum, Min } from 'class-validator';
import { EstadoCuota } from '../entities/cuota.entity';

export class CreateCuotaDto {
  @IsNumber()
  @Min(1)
  numeroCuota: number;

  @IsNumber()
  @Min(0)
  monto: number;

  @IsDateString()
  fechaVencimiento: string;

  @IsString()
  @IsNotEmpty()
  matriculaId: string;

  @IsBoolean()
  @IsOptional()
  pagado?: boolean;

  @IsDateString()
  @IsOptional()
  fechaPago?: string;

  @IsEnum(EstadoCuota)
  @IsOptional()
  estado?: EstadoCuota;
}
