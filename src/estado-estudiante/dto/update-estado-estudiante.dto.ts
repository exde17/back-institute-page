import { PartialType } from '@nestjs/mapped-types';
import { CreateEstadoEstudianteDto } from './create-estado-estudiante.dto';

export class UpdateEstadoEstudianteDto extends PartialType(CreateEstadoEstudianteDto) {}
