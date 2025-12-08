import { IsString, IsNotEmpty, IsOptional } from "class-validator";

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
}
