import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { Inscripcion } from "src/inscripcion/entities/inscripcion.entity";

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
  inscripcion: Inscripcion;
}
