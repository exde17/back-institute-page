import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CategoriaEstudiante } from 'src/categoria-estudiante/entities/categoria-estudiante.entity';
import { Departamento } from 'src/departamento/entities/departamento.entity';
import { EstadoEstudiante } from 'src/estado-estudiante/entities/estado-estudiante.entity';
import { Grupo } from 'src/grupos/entities/grupo.entity';
import { Municipio } from 'src/municipio/entities/municipio.entity';
import { NivelEducativo } from 'src/nivel-educativo/entities/nivel-educativo.entity';
import { Parentesco } from 'src/parentesco/entities/parentesco.entity';
import { TipoDocumento } from 'src/tipo-documento/entities/tipo-documento.entity';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  tipoDocumento: TipoDocumento;

  @IsString()
  @IsNotEmpty()
  documentNumber: string;

  @IsString()
  @IsNotEmpty()
  lugarExpedicion: Municipio;

  @IsString()
  @IsNotEmpty()
  birthDate: string;

  @IsString()
  @IsNotEmpty()
  nationality: string;

  @IsString()
  @IsNotEmpty()
  municipioNacimiento: Municipio;

  @IsString()
  @IsNotEmpty()
  departamentoNacimiento: Departamento;

  @IsString()
  @IsOptional()
  barrio?: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  telephone?: string;

  @IsString()
  @IsOptional()
  address?: string;

  // REFERENCIAS FAMILIARES
  @IsString()
  @IsOptional()
  nombreAcudiente?: string;

  @IsString()
  @IsOptional()
  numeroContactoAcudiente?: string;

  @IsString()
  @IsOptional()
  parentesco?: Parentesco;

  @IsString()
  @IsOptional()
  direccionAcudiente?: string;

  // INFORMACIÓN ACADÉMICA
  @IsString()
  @IsOptional()
  nivelEducativo?: NivelEducativo;

  @IsString()
  @IsOptional()
  anioCertificacion?: string;

  @IsString()
  @IsOptional()
  institucionEducativa?: string;

  @IsString()
  @IsOptional()
  departamentoInstitucion?: Departamento;

  @IsString()
  @IsOptional()
  municipioInstitucion?: Municipio;

  // CONDICIONES ESPECIALES
  @IsBoolean()
  @IsOptional()
  limitacionFisicaCognitiva?: boolean;

  @IsString()
  @IsOptional()
  descripcionLimitacion?: string;

  @IsString()
  @IsOptional()
  grupo?: Grupo;

  @IsString()
  @IsOptional()
  categoriaEstudiante?: CategoriaEstudiante;

  @IsString()
  @IsOptional()
  estadoEstudiante?: EstadoEstudiante;
}
