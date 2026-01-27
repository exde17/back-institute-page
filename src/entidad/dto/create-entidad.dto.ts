import { IsString, IsNotEmpty, IsOptional, IsEmail, IsBoolean } from 'class-validator';

export class CreateEntidadDto {
  @IsString()
  @IsNotEmpty()
  razonSocial: string;

  @IsString()
  @IsNotEmpty()
  nit: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsEmail()
  @IsOptional()
  correo?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
