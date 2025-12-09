import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProgramaDto {
    @IsString()
    nombre: string;

    @IsString()
    @IsOptional()
    descripcion: string;

    @IsNumber()
    duracion: number;

    @IsNumber()
    costo: number;

    @IsString()
    @IsOptional()
    imagen: string;

    @IsString()
    @IsOptional()
    modalidad: string;

    @IsString()
    @IsOptional()
    categoria: string;

    @IsString()
    @IsOptional()
    badge: string;

    @IsString()
    @IsOptional()
    badgeColor: string;

    @IsString()
    @IsOptional()
    semestres: string;

    @IsString()
    @IsOptional()
    detalles: string;
    
}
