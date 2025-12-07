import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaEstudianteDto } from './create-categoria-estudiante.dto';

export class UpdateCategoriaEstudianteDto extends PartialType(CreateCategoriaEstudianteDto) {}
