import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNoticiaDto {
    @IsString()
    @IsNotEmpty()
    titulo: string;

    @IsString()
    @IsNotEmpty()
    contenido: string;

    @IsString()
    @IsOptional()
    imagenUrl?: string;

    @IsString()
    @IsOptional()
    fecha?: Date;
}
