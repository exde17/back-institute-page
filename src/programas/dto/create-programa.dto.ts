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
    
}
